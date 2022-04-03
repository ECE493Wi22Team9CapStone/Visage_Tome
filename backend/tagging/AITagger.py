import math
import os
import glob
from pathlib import Path

import tensorflow as tf

# make sure tensorflow is using GPU (if available)
os.environ["CUDA_VISIBLE_DEVICES"] = "0"

MODEL_DIR = os.path.dirname(os.path.abspath(__file__)) + '/pretrain_open_images'
PARENT_DIR = Path(__file__).parent.parent

# using the Singleton design pattern 
# from https://medium.com/techtofreedom/3-levels-of-understanding-the-singleton-pattern-in-python-4bf429a10438
class Singleton():
    _instance = None

    # Making the class Singleton
    # make sure there is only one instance of the class
    def __new__(cls, *args, **kwargs):
        if Singleton._instance is None:
            Singleton._instance = object.__new__(cls, *args, **kwargs)
        return Singleton._instance

class AITagger(Singleton):
    def __init__(self):
        self.label_path = MODEL_DIR + '/classes-trainable.txt'
        self.description_path = MODEL_DIR + '/class-descriptions.csv'
        self.checkpoint_path = MODEL_DIR + '/oidv2-resnet_v1_101.ckpt'
        self.batch_size = 10
        # how many labels to return for one image
        self.top_results = 3

        # load the labels
        self.labels = []
        self.get_labels()

    def get_labels(self):
        """
        we have ~20k label_id-label pairs in class description,
        but only 5k label_id in classes-trainable.txt that are trained
        Have to do a mapping to extract the labels that can be used
        """
        label_ids = []
        label_descriptions = {}
        for label_id in tf.io.gfile.GFile(self.label_path):
            label_ids.append(label_id.strip())
        for line in tf.io.gfile.GFile(self.description_path):
            string = [line.strip(' "\n') for line in line.split(',', 1)]
            label_descriptions[string[0]] = string[1]
        for label_id in label_ids:
            self.labels.append(label_descriptions[label_id])

    def predict(self, image_paths):
        prediction_result = []

        # https://www.tensorflow.org/api_docs/python/tf/compat/v1/train/import_meta_graph
        # creating a saver and loading the model
        with tf.compat.v1.Session() as session:
            saver = tf.compat.v1.train.import_meta_graph(self.checkpoint_path + '.meta')
            saver.restore(session, self.checkpoint_path)

            input = tf.compat.v1.get_default_graph().get_tensor_by_name('input_values:0')
            predictions = tf.compat.v1.get_default_graph().get_tensor_by_name('multi_predictions:0')

            for image in image_paths:
                if not os.path.isfile(image):
                    continue

                try:
                    compressed_image = tf.io.gfile.GFile(image, 'rb').read()
                    result = session.run(predictions, feed_dict={input: [compressed_image]})

                    # map the probabilities to labels
                    result_map = dict(zip(self.labels, result))
                    # return the top results specified by self.top_results
                    best_labels = sorted(result_map, key=result_map.get, reverse=True)[:self.top_results]
                    prediction_result.extend(best_labels)
                except Exception as error:
                    print('Error occured when making prediction to %s: %s', image, error)
        
        # eliminate potential duplicates before returning
        return list(set(prediction_result))

    def tag_images(self, image_paths):
        images_len = len(image_paths)
        batches = math.ceil(images_len / self.batch_size)

        predictions = []

        # split the tagging process into batches for memory management
        for index in range(batches):
            start_idx = index * self.batch_size
            end_idx = (index + 1) * self.batch_size
            end_idx = end_idx if end_idx <= images_len else images_len

            # Get images for the current batch
            image_batch = image_paths[start_idx:end_idx]

            predictions.extend(self.predict(image_batch))

        return predictions
    
    def tag(self):
        imagePaths = []

        exts = ["*.jpg", "*.png"]

        # the view will upload all images to /media/tag_images/ folder
        for ext in exts:
            images = str(PARENT_DIR) + "/media/tag_images/" + ext
            imagePaths.extend(glob.glob(images))

        print(f"Found {len(imagePaths)} images to tag, begin tagging...")
        result = {
            "tags": self.tag_images(imagePaths)
        }

        # remove the images from the server before returning
        files = glob.glob(str(PARENT_DIR) + "/media/tag_images/*")
        for f in files:
            os.remove(f)

        return result
    
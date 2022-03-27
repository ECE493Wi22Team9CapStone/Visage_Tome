import os
import glob
import csv
from pathlib import Path
from heapq import nlargest

from .tagging import AITagger

def tagImages():
    # Get paths of tag images
    PARENT_DIR = Path(__file__).parent.parent
    imagePaths = []

    exts = ["*.JPG", "*.jpg"]

    for ext in exts:
        pathPattern = str(PARENT_DIR) + "/images/tag_images/" + ext
        imgPaths = glob.glob(pathPattern)
        imagePaths.extend(imgPaths)


    print('Process ', len(imagePaths), ' photos')

    # Do tagging
    results = AITagger.do_tagging_process(imagePaths)


    returnList = []
    for img_path in results:

        predict_list_5000 = results[img_path]

        imgdict = dict(zip(AITagger.label_5000_list,predict_list_5000))
        sortedDict = dict(sorted(imgdict.items(), key=lambda item: item[1], reverse=True))
        topDict = nlargest(4, sortedDict, key = sortedDict.get)

        returnList.extend(topDict)
    result = {
        "tags": returnList
    }

    files = glob.glob(str(PARENT_DIR) + "/images/tag_images/*")
    for f in files:
        os.remove(f)
    return result
    
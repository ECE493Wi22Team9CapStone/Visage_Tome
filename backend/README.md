## Deployment Instructions
1. Make sure python3.6+ is installed on your machine
2. Creating a `.env` file inside the backend/ folder, and put the following inside the file:
```
SECRET_KEY=<generated_key>
DEBUG=True
```
replace `<generated_key>` with a key generated [at this link](https://djecrety.ir/)

3. activate virtualenv (Optional)
4. install the required modules by `pip3 install -r requirements.txt`
5. migrate all model changes by  `python3 manage.py migrate`
6. run the backend application by `python3 manage.py runserver`
7. you can view the list of available endpoints on [http://localhost:8000](http://localhost:8000)
8. Check the **AITagger Model** section below to setup the model

### Troubleshooting
1. Make sure your python version is >= 3.6
2. If any steps complain about the secret key, try regenerating a secert key, as your specific secret key might contain forbidden character(s).

## Documentation
The API Documentation exist on the Swagger UI at [http://localhost:8000](http://localhost:8000), you can click on the individual endpoints to view its description.

## AITagger Model
Due to the size of the pretrained model, we cannot upload it directly with our repository.
A separate submission **pretrain_open_images_final.zip** is included in the Final Submission Folder in Google Drive, you can also get it using [this link](https://drive.google.com/file/d/154jN6MP1DPLUzztuTLSJUMXrDiw-s3-l/view?usp=sharing)

After downloading the .zip file, extract the 3 files, and place all 3 files inside the `backend/tagging/pretrain_open_images/` folder

## Admin User
Currently there is no option to create an admin user on the frontend application
To create a admin, you can run the following utlity command provided by Django:
`python3 manage.py createsuperuser`

After the admin user is created, you can use this user to login to the frontend application and access the [django admin panel](http://localhost:8000/admin)

## Citation
The pretrained model is obtained from https://www.dropbox.com/s/kx5n8bjwhl9qecx/pretrain_open_images.zip?dl=0
Which is the open image dataset described here: https://github.com/openimages/dataset/blob/main/READMEV2.md

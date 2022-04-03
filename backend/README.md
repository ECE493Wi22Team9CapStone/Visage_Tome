## Deployment Instructions
1. Creating a `.env` file inside the backend folder, and put the following inside the file:
```
SECRET_KEY=<generated_key>
DEBUG=True
```
you can generate a secret key [at this link](https://djecrety.ir/)

2. activate virtualenv (Optional)
3. install the required modules by `pip3 install -r requirements.txt`
4. migrate all model changes by  `python3 manage.py migrate`
5. run the backend application by `python3 manage.py runserver`
6. you can view the list of available endpoints on [http://localhost:8000](http://localhost:8000)

## Admin User
Currently there is no option to create an admin user on the frontend application
To create a admin, you can run the following utlity command provided by Django:
`python3 manage.py createsuperuser`

After the admin user is created, you can use this user to login to the frontend application and access the [django admin panel](http://localhost:8000/admin)
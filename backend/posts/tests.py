from django.test import TestCase, override_settings
from rest_framework.test import APIClient
from rest_framework.authtoken.models import Token
from django.core.files.uploadedfile import SimpleUploadedFile
from django.utils import timezone
from posts.models import *
from users.models import User
import shutil, tempfile

# making a temporary directory for the images
MEDIA_ROOT = tempfile.mkdtemp()

@override_settings(MEDIA_ROOT=MEDIA_ROOT)
class PostTestCases(TestCase):
    def setUp(self):
        self.client = APIClient()

        # 2 posts created for testing
        self.post = Post.objects.create(
            id = "post-id-1",
            display_name='Ze Hui Peng',
            title='Test Post 1',
            description='This post will be used for GET requests',
            tags='test case, GET request',
            date_expiry=timezone.now() + timezone.timedelta(days=1)
        )
        self.post_image = Image.objects.create(
            post=self.post,
            image=SimpleUploadedFile(name='post-id-1-image.png', content=b'', content_type='image/png')
        )
        self.post2 = Post.objects.create(
            id = "post-id-2",
            display_name='Ze Hui Peng',
            title='Test Post 2',
            description='This post will be used for GET requests',
            tags='test case, GET request',
            date_expiry=timezone.now() + timezone.timedelta(days=1),
        )
        self.post_image2 = Image.objects.create(
            post=self.post2,
            image=SimpleUploadedFile(name='post-id-2-image.png', content=b'', content_type='image/png')
        )

        # admin user
        self.admin = User.objects.create_superuser(
            username='admin',
            password='admin'
        )
        Token.objects.create(user=self.admin)

        # self.user 1 will be pre created as a non-admin user
        self.user = User.objects.create_user(
            username='user',
            password='user'
        )
        Token.objects.create(user=self.user)

        # self.user2 will be pre created with a like to self.post
        self.user2 = User.objects.create_user(
            username='user2',
            password='user2'
        )
        Token.objects.create(user=self.user2)
        Like.objects.create(
            post=self.post,
            user=self.user2
        )

    def test_post_create_successful(self):
        """
        Test #1: Verify whether a post can be successfully created
        """

        # the images field have to be mocked
        payload = {
            "display_name": "Ze Hui Peng",
            "title": "Test Case #1 Post",
            "description": "Verify whether a post can be successfully created",
            "images": [
                SimpleUploadedFile(name='test_image.png', content=b'', content_type='image/png')
            ],
            "tags": "test case,test plan"
        }
        response = self.client.post('/posts/', payload)
        self.assertEqual(response.status_code, 200)

        # check response body
        self.assertIn('id', response.data)
        self.assertEqual(response.data['display_name'], payload['display_name'])
        self.assertEqual(response.data['title'], payload['title'])
        self.assertEqual(response.data['description'], payload['description'])
        self.assertIn('images', response.data)
        self.assertEqual(response.data['tags'], payload['tags'])
        self.assertIn('date_posted', response.data)
        self.assertIn('date_expiry', response.data)
        self.assertEqual(response.data['likes'], 0)
        self.assertEqual(response.data['comments'], [])

    def test_post_create_missing_images(self):
        """
        Test #2: Verify whether a post can be successfully created without images
        """

        payload = {
            "display_name": "Ze Hui Peng",
            "title": "Test Case #2 Post",
            "description": "Verify whether a post can be successfully created without images",
            "tags": "test case,test plan"
        }
        response = self.client.post('/posts/', payload)
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.data, "Post does not include 'images' field")

    def test_post_create_missing_title(self):
        """
        Test #3: Verify whether a post can be successfully created without one of the basic fields
        Expected Result: post should not be created with missing fields
        """

        payload = {
            "display_name": "Ze Hui Peng",
            "description": "Verify whether a post can be successfully created without one of the basic fields",
            "images": [
                SimpleUploadedFile(name='test_image.png', content=b'', content_type='image/png')
            ],
            "tags": "test case,test plan"
        }
        response = self.client.post('/posts/', payload)
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.data, {'title': ['This field is required.']})
    
    def test_post_get_successful(self):
        """
        Test #4: Verify whether we can retrieve an existing post
        """

        response = self.client.get('/posts/' + self.post.id + "/")
        self.assertEqual(response.status_code, 200)

        # check response body
        self.assertEqual(response.data['id'], self.post.id)
        self.assertEqual(response.data['display_name'], self.post.display_name)
        self.assertEqual(response.data['title'], self.post.title)
        self.assertEqual(response.data['description'], self.post.description)
        self.assertIn('images', response.data)
        self.assertEqual(response.data['tags'], self.post.tags)
        self.assertIn('date_posted', response.data)
        self.assertIn('date_expiry', response.data)
        # user2 added a like to this post
        self.assertEqual(response.data['likes'], 1)
        self.assertEqual(response.data['comments'], [])

    def test_post_get_invalid_id(self):
        """
        Test #5: Verify whether we can retrieve a post with invalid id
        """

        response = self.client.get('/posts/post-id-493/')
        self.assertEqual(response.status_code, 404)
        self.assertEqual(response.data, "Post id does not exist")
    
    def test_posts_get_successful(self):
        """
        Test #6: Verify whether we can retrieve all posts
        """

        response = self.client.get('/posts/')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["pages"], 1)
        # posts are returned in reverse order of creation time
        self.assertEqual(len(response.data["posts"]), 2)
        self.assertEqual(response.data["posts"][1]["id"], self.post.id)
        self.assertEqual(response.data["posts"][0]["id"], self.post2.id)
    
    def test_posts_get_successful_with_filter(self):
        """
        Test #7: Verify whether we can retrieve posts with filtered criteria, only post(s) match the filtered criteria should be returned
        """

        response = self.client.get('/posts/?search=Test%20Post%202')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["pages"], 1)

        # here we should only expect post2 to be returned
        self.assertEqual(len(response.data["posts"]), 1)
        self.assertEqual(response.data["posts"][0]["id"], self.post2.id)
    
    def test_post_delete_successful(self):
        """
        Test #8: Verify whether admin can successfully delete an existing post
        """
        headers = {
            'HTTP_AUTHORIZATION': 'Token ' + Token.objects.get(user=self.admin).key
        }
        response = self.client.delete('/posts/' + self.post.id + "/", **headers)
        self.assertEqual(response.status_code, 204)

    def test_post_delete_invalid_id(self):
        """
        Test #9: Verify whether admin can successfully delete a non-existing post id
        """

        headers = {
            'HTTP_AUTHORIZATION': 'Token ' + Token.objects.get(user=self.admin).key
        }
        response = self.client.delete("/posts/post-id-493/", **headers)
        self.assertEqual(response.status_code, 404)
        self.assertEqual(response.data, "Post id does not exist")
    
    def test_post_delete_non_admin(self):
        """
        Test #10: Verify whether a non admin user can successfully delete an existing post
        """

        headers = {
            'HTTP_AUTHORIZATION': 'Token ' + Token.objects.get(user=self.user).key
        }
        response = self.client.delete('/posts/' + self.post.id + "/", **headers)
        self.assertEqual(response.status_code, 403)
        self.assertEqual(response.data, "Only admin can delete posts")
    
    def test_post_delete_unauthorized(self):
        """
        Test #11: Verify whether anyone can successfully delete an existing post without authorization header
        """

        response = self.client.delete('/posts/' + self.post.id + "/")
        self.assertEqual(response.status_code, 401)
    
    def test_post_like_create_successful(self):
        """
        Test #12: Verify whether registered user can like a post
        """

        headers = {
            'HTTP_AUTHORIZATION': 'Token ' + Token.objects.get(user=self.user).key
        }
        response = self.client.post('/posts/' + self.post.id + "/like/", **headers)
        self.assertEqual(response.status_code, 200)
    
    def test_post_like_create_duplicate(self):
        """
        Test #13: Verify whether registered user can like a post more than once
        """


        headers = {
            'HTTP_AUTHORIZATION': 'Token ' + Token.objects.get(user=self.user2).key
        }

        # here user2 should have already like the post before the request
        response = self.client.post('/posts/' + self.post.id + "/like/", **headers)
        self.assertEqual(response.status_code, 409)
    
    def test_post_like_invalid_id(self):
        """
        Test #14: Verify whether registered user can like a non-existing post
        """

        headers = {
            'HTTP_AUTHORIZATION': 'Token ' + Token.objects.get(user=self.user).key
        }
        response = self.client.post('/posts/post-id-493/like/', **headers)
        self.assertEqual(response.status_code, 404)
        self.assertEqual(response.data, "Post id does not exist")
    
    def test_post_like_create_unauthorized(self):
        """
        Test #15: Verify whether anyone can like a post without authorization header
        """

        response = self.client.post('/posts/' + self.post.id + "/like/")
        self.assertEqual(response.status_code, 401)
    
    def test_post_like_get_liked_status_true(self):
        """
        Test #16: Verify whether registered user can get their liked status on a post when user already liked the post
        """

        headers = {
            'HTTP_AUTHORIZATION': 'Token ' + Token.objects.get(user=self.user2).key
        }
        response = self.client.get('/posts/' + self.post.id + "/like/", **headers)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["liked"], True)

    def test_post_like_get_liked_status_false(self):
        """
        Test #17: Verify whether registered user can get their liked status on a post when user did not like the post
        """

        headers = {
            'HTTP_AUTHORIZATION': 'Token ' + Token.objects.get(user=self.user).key
        }
        response = self.client.get('/posts/' + self.post.id + "/like/", **headers)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["liked"], False)
    
    def test_post_like_get_invalid_id(self):
        """
        Test #18: Verify whether registered user can get their liked status on a non-existing post
        """

        headers = {
            'HTTP_AUTHORIZATION': 'Token ' + Token.objects.get(user=self.user).key
        }
        response = self.client.get('/posts/post-id-493/like/', **headers)
        self.assertEqual(response.status_code, 404)
        self.assertEqual(response.data, "Post id does not exist")

    def test_post_like_get_unauthorized(self):
        """
        Test #19: Verify whether anyone can get their liked status on a post without authorization header
        """

        response = self.client.get('/posts/' + self.post.id + "/like/")
        self.assertEqual(response.status_code, 401)

    def test_post_comment_successful(self):
        """
        Test #20: Verify whether registered user can comment on a post
        """

        headers = {
            'HTTP_AUTHORIZATION': 'Token ' + Token.objects.get(user=self.user).key
        }
        payload = {
            "content": "Test Comment"
        }
        response = self.client.post(
            '/posts/' + self.post.id + "/comment/", 
            payload, 
            **headers
        )
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["id"], self.post.id)
        self.assertEqual(response.data["comments"][0]["content"], payload["content"])

    def test_post_comment_missing_content(self):
        """
        Test #21: Verify whether registered user can comment on a post without any content
        """

        headers = {
            'HTTP_AUTHORIZATION': 'Token ' + Token.objects.get(user=self.user).key
        }
        response = self.client.post(
            '/posts/' + self.post.id + "/comment/", 
            **headers
        )
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.data, {'content': ['This field is required.']})

    def test_post_comment_invalid_id(self):
        """
        Test #22: Verify whether registered user can comment on a non-existing post
        """

        headers = {
            'HTTP_AUTHORIZATION': 'Token ' + Token.objects.get(user=self.user).key
        }
        payload = {
            "content": "Test Comment"
        }
        response = self.client.post(
            '/posts/post-id-493/comment/', 
            payload, 
            **headers
        )
        self.assertEqual(response.status_code, 404)
        self.assertEqual(response.data, "Post id does not exist")
    
    def test_post_comment_unauthorized(self):
        """
        Test #23: Verify whether anyone can comment on a post without authorization header
        """
            
        payload = {
            "content": "Test Comment"
        }
        response = self.client.post('/posts/' + self.post.id + "/comment/", payload)
        self.assertEqual(response.status_code, 401)
    
    def tearDown(self):
        shutil.rmtree(MEDIA_ROOT)
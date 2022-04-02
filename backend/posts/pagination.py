"""
    This file contains the pagination logic for returning list of posts
    Related Functional Requirements:
    * FR8 - View.Posts
    * FR9 - Search.Post
"""

from rest_framework.pagination import PageNumberPagination
from rest_framework.response import Response

class PostPagination(PageNumberPagination):
    page_size = 6
    page_size_query_param = 'pages'
    max_page_size = 100

    def get_paginated_response(self, data):
        response = {
            "pages": self.page.paginator.num_pages,
            "posts": data
        }
        return Response(response)
from flask import jsonify, Blueprint
from app import app
from models import Post , User

getposts_blueprint = Blueprint('getposts', __name__)

@app.route('/api/getposts', methods=['GET'])
def get_posts():
    posts = Post.query.all()
    post_list = []
    for post in posts:
        user = User.query.filter_by(email=post.email).first()
        opening_hours= user.opening_hours.split(',')
        closing_hours= user.closing_hours.split(',')
        post_dict = {
            'farmName': post.farmName,
            'farm_address': user.address,
            'phone': user.phone_number_official,
            'email': post.email,
            'about': user.about,
            'prices': user.products,
            'delivery_details': user.delivery_details,
            'farm_images_list': user.farm_pictures.split(','),
            'products_images_list': user.products_pictures.split(','),
            'whatsapp': user.phone_number_whatsapp,
            'instagram': user.instagram,
            'facebook': user.facebook,
            'farm_site': user.farm_site,
            'opening_hours': opening_hours,
            'closing_hours': closing_hours,
            'profilePicture': post.profilePicture,
            'photo': post.photo,
            'desc': post.desc,
            'posted': post.posted,
            'date': post.event_date.strftime('%m/%d/%Y') if post.event_date else None,
            'location': post.location,
            'when_posted_date': post.date,
            'when_posted_time': post.time,
            'id': post.id,
            'time': post.time_range,
        }
        post_list.append(post_dict)

    # The next line ensures the posts are sorted such that the latest posts are presented first.
    post_list.sort(key=lambda post: (post['when_posted_date'], post['when_posted_time']), reverse=True)

    return jsonify(post_list)
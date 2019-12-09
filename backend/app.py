from flask import Flask, request
from flask import abort
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from werkzeug.security import generate_password_hash, check_password_hash
from flask_login import LoginManager
from flask_login import UserMixin
import uuid

app = Flask(__name__)
login = LoginManager(app)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///test.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS '] = False
db = SQLAlchemy(app)
migrate = Migrate(app, db)


class Users(UserMixin, db.Model):
    id = db.Column(db.Integer, primary_key=True)
    guid = db.Column(db.Integer, db.ForeignKey('guid.guid'))
    role = db.Column(db.String(20), default="student", unique=False, nullable=True)
    login = db.Column(db.String(30), unique=True, nullable=True)
    password = db.Column(db.String(16), unique=False, nullable=True)
    first_name = db.Column(db.String(30), unique=False, nullable=True)
    second_name = db.Column(db.String(30), unique=False, nullable=True)
    middle_name = db.Column(db.String(30), unique=False, nullable=True)
    email = db.Column(db.String(30), unique=True, nullable=True)
    token = db.Column(db.Integer, unique=True, nullable=True)

    def set_password(self, password):
        self.password = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password, password)


class Guid(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    guid = db.Column(db.Integer)
    group = db.Column(db.String(20), unique=True, nullable=False)
    active = db.Column(db.BOOLEAN(), unique=True, nullable=False)


'''
{
guid:int
login:string
password:string
first_name:string
second_name:string
middle_name:string
email:string 
}
'''


@app.route('/reg', methods=['POST'], )
def reg():
    user_data = request.get_json()
    if user_data is None:
        return abort(400)
    try:
        guid = Guid.query.filter_by(guid=user_data['guid']).first()
        if guid is None:
            return abort(400)
        if not guid.active:
            return abort(400)
    except:
        return abort(400)
    try:
        User = Users(login=user_data['login'], email=user_data['email'], token=uuid.uuid4().hex)
        User.set_password(user_data['password'])
    except:
        return abort(400)
    try:
        db.session.add(User)
        db.session.commit()
    except:
        return abort(500)
    return abort(200)


@app.route('/login', methods=['POST'])
def login():
    user_data = request.get_json()
    print(user_data)
    if user_data is None:
        return abort(400)
    user = Users.query.filter_by(login=user_data['login'],
                                 password=generate_password_hash(user_data['password'])).first()
    if user is not None:
        return user.token
    return abort(401)


@app.route('/')
def hello_world1():
    return "2"


if __name__ == '__main__':
    app.run(debug=True)

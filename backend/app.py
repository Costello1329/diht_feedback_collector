import uuid

from flask import Flask, request
from flask import abort
from flask import jsonify
from flask_migrate import Migrate
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///test.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS '] = False
db = SQLAlchemy(app)
migrate = Migrate(app, db)


class Users(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    guid = db.Column(db.Integer, db.ForeignKey('guid.guid'))
    role = db.Column(db.String(20), default="student", unique=False, nullable=True)
    login = db.Column(db.String(30), unique=True, nullable=True)
    password = db.Column(db.String(16), unique=False, nullable=True)

    def check_password(self, password):
        return self.password == password


class Guid(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    guid = db.Column(db.Integer, unique=True)
    group = db.Column(db.String(20), unique=False, nullable=False)
    active = db.Column(db.BOOLEAN(), default=False, unique=False, nullable=False)


'''
{
guid:int
login:string
password:string
confirmation:string
email:string 
}
'''


def set_reg_json(isTokenValid, isTokenActivated, isConfirmationValid, isLoginValid):
    return jsonify(isTokenValid=isTokenValid,
                   isTokenUnActivated=isTokenActivated,
                   isConfirmationValid=isConfirmationValid,
                   isLoginValid=isLoginValid)


@app.route('/reg', methods=['POST'], provide_automatic_options=False)
def reg():
    if request.method != "POST":
        return abort(405)
    user_data = request.get_json()
    if user_data is None:
        return abort(400)
    try:
        guid = Guid.query.filter_by(guid=user_data['token']).first()
        if guid is None:
            return set_reg_json(False, "undefined", "undefined", "undefined"), 400
        if guid.active:
            return set_reg_json(True, False, "undefined", "undefined"), 400
    except:
        return abort(500)
    try:
        # uuid.uuid4().hex
        if user_data["password"] != user_data["confirmation"]:
            return set_reg_json(True, True, False, "undefined"), 400
        if Users.query.filter_by(login=user_data['login']).first() is not None:
            return set_reg_json(True, True, True, False), 400
        User = Users(login=user_data['login'], password=user_data['password'], guid=guid.guid)
    except:
        return abort(500)
    try:
        db.session.add(User)
        guid.active = True
        db.session.add(guid)
        db.session.commit()
    except:
        return abort(500)
    return set_reg_json(True, True, True, True), 200


def set_login_json(isLoginExist, isPasswordValid):
    return jsonify(isLoginExist=isLoginExist,
                   isPasswordValid=isPasswordValid)


@app.route('/login', methods=['POST'], provide_automatic_options=False)
def login():
    user_data = request.get_json()
    if request.method != "POST":
        return abort(405)
    if user_data is None:
        return abort(400)
    try:
        user = Users.query.filter_by(login=user_data['login']).first()
        if user is None:
            return set_login_json(False, "undefined"), 403
        if not user.check_password(user_data["password"]):
            return set_login_json(True, False), 403
    except:
        return abort(500)
    res = set_login_json(True, True)

    res.set_cookie("auth-token", value=uuid.uuid4().hex)
    return res


@app.route('/')
def hello_world1():
    return "2"


if __name__ == '__main__':
    app.run(debug=True)

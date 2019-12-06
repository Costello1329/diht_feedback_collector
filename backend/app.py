from flask import Flask, request
from flask import abort
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///tmp/test.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS '] = False
db = SQLAlchemy(app)
migrate = Migrate(app, db)

class Guid(db.Model):
    guid = db.Column(db.Integer, primary_key=True)
    group = db.Column(db.String(20), unique=True, nullable=False)
    active = db.Column(db.BOOLEAN(), unique=True, nullable=False)

class Users(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    guid = db.Column(db.Integer, db.ForeignKey('guid.id'))
    role = db.Column(db.String(20), unique=True, nullable=False)
    login = db.Column(db.String(30), unique=True, nullable=False)
    password = db.Column(db.String(16), unique=True, nullable=False)
    first_name = db.Column(db.String(30), unique=True, nullable=False)
    second_name = db.Column(db.String(30), unique=True, nullable=False)
    middle_name = db.Column(db.String(30), unique=True, nullable=False)
    email = db.Column(db.String(30), unique=True, nullable=False)


@app.route('/a', methods=['POST'], )
def hello_world():
    json_string = request.get_json()
    if json_string is None:
        return abort(400)
    print(json_string)

    return "1"


@app.route('/')
def hello_world1():
    return "2"


if __name__ == '__main__':

    app.run(debug=True)

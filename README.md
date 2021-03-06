# LanguageSurvey: Le site du DLC dédié au questionnaire langues

## Index

1.  [Dependencies](#dependencies)
2.  [Installation](#installation)
3.  [Local compile](#local-compile)
4.  [Deploy in production](#deploy-in-production)

## Dependencies

- [anaconda](https://www.anaconda.com/distribution/)

## Installation

Install a conda environment:

```bash
conda create -n languagesurvey python=3.7.4
conda activate languagesurvey
pip install -r services/requirements.txt
```

_N.B.:_ The `requirements.txt` file has been generated with the following command lines:

```bash
conda create -n languagesurvey python=3.7.4
conda activate languagesurvey
pip install black flake8 flask flask_bcrypt flask_cors flask_jwt_extended flask_mail flask_login flask_pymongo names numpy pymongo pymprog
pip freeze > services/requirements.txt
```

## Local compile

### Launch Back

#### Install MongoDB

```bash
sudo apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv 9DA31620334BD75D9DCB49F368818C72E52529D4
echo "deb [ arch=amd64 ] https://repo.mongodb.org/apt/ubuntu bionic/mongodb-org/4.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-4.0.list
sudo apt-get update
sudo aptitude install -y mongodb-org
```

#### Launch MongoDB and API

Before the first use: Launch `db_test.py` to initialize test database (to be launched only with local config):

```bash
python services/db_test.py
```

Launch MongoDB and API:

```bash
sudo service mongodb start
python services/__init__.py
```

### Launch Front

```bash
cd components
npm install
npm start
```

## Create applications

### Create APP (Front)

```bash
cd components
npm install -g heroku
heroku create -a language-survey-app
heroku git:remote -a language-survey-app
cd ..
git subtree push --prefix components heroku master
```

### Create API (Back)

```bash
cd services
npm install -g heroku
heroku create -a language-survey-api
heroku git:remote -a language-survey-api
cd ..
git subtree push --prefix services heroku master
```

## Deploy in production

### Deploy APP (Front)

1. Set `const PROD = true` in `components/src/url.js`
2. Add, commit and push changes to Git repository
3. Deploy the app:

```bash
cd components
heroku git:remote -a language-survey-app
cd ..
git subtree push --prefix components heroku master
```

### Deploy API (Back)

1. Put `config-prod.py` into `config.py`
2. Add, commit and push changes to Git repository
3. Deploy the api:

```bash
cd services
heroku git:remote -a language-survey-api
cd ..
git subtree push --prefix services heroku master
```

## Access

### APP URLs

Main URL: `https://language-survey-app.herokuapp.com/`
All URLs in file `components/src/index.js`:

- `/form`:
- `/login`:
- `/admin`:
- `/admin/login`:
- `/admin/manage-courses`:
- `/admin/get-affect`:
- `/admin/manage-students`:
- `/admin/change-students`:

### API URLs

Main URL: `https://language-survey-api.herokuapp.com/`

## Tree structure of the code

### Folders tree

```bash
tree -d -I "node_modules" > tree.txt
```

```
.
├── components                  #
│   ├── public                  #
│   └── src                     #
│       ├── admin               #
│       │   └── components      #
│       ├── images              #
│       └── survey              #
│           └── components      #
└── services                    #
```

### Detailed tree

```bash
tree -I "node_modules" > tree.txt
```

```
.
├── components
│   ├── package.json
│   ├── package-lock.json
│   ├── public
│   │   ├── enpc_favicon.ico
│   │   ├── index.html
│   │   └── manifest.json
│   └── src
│       ├── 404.js
│       ├── admin
│       │   ├── Admin.css
│       │   ├── Admin.js
│       │   ├── AdminLogin.js
│       │   └── components
│       │       ├── changeStudent.js
│       │       ├── CourseEditing.css
│       │       ├── CourseEditing.js
│       │       ├── getAffect.js
│       │       ├── resultPage.js
│       │       └── studentManagement.js
│       ├── images
│       │   ├── background_image.jpg
│       │   ├── edit_button.png
│       │   ├── error_panel.png
│       │   ├── header_banner.png
│       │   ├── plus_button.png
│       │   └── suppr_button.png
│       ├── index.css
│       ├── index.js
│       ├── survey
│       │   ├── components
│       │   │   ├── courseRankingInstructions.js
│       │   │   ├── courseRankingQuestion.js
│       │   │   ├── courseRankingTools.js
│       │   │   ├── initialQuestions.js
│       │   │   └── utils.js
│       │   ├── LoginPage.css
│       │   ├── LoginPage.js
│       │   ├── Questionnaire.css
│       │   ├── Questionnaire.js
│       │   └── VowGenerator.js
│       └── url.js
├── README.md
└── services
    ├── config-local.py
    ├── config-prod.py
    ├── config.py
    ├── data_structs.py
    ├── db_test.py
    ├── __init__.py
    ├── Procfile
    ├── random_data.py
    ├── requirements.txt
    ├── runtime.txt
    └── solver.py
```

## TODO list:

To be detailed as much as possible

1. Check workflow of front
2. Check workflow of back
3. Extraction of results in Excel files
4. ...

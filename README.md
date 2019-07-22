# LanguageSurvey
## Le site de la DLC dédié au questionnaire langues

# Compiler en local
## Lancer le back

1) Installer MongoDB

```
sudo apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv 9DA31620334BD75D9DCB49F368818C72E52529D4
```

```
echo "deb [ arch=amd64 ] https://repo.mongodb.org/apt/ubuntu bionic/mongodb-org/4.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-4.0.list
```
```
sudo apt-get update
```
```
sudo apt-get install -y mongodb-org
```

2) Installer pymongo
```
pip install pymongo
```

3) Lancer mongoDB puis se placer dans services
```
sudo service mongod start
```
```
cd services
```

4) Copier le contenu de config-local.py dans config.py

(Premiere utilisation : lancer db_test.py pour initier la base de données de test)

5) lancer l'API
```
python __init__.py
```

## Lancer le front

```
npm install
```
```
npm start
```


# Déployer en production
# Front

Dans components :
1) Mettre dans components/url.js la variable prod à true
2) git push
3) Se connecter a heroku :
npm install -g heroku

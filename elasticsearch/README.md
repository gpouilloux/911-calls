# 911 Calls avec ElasticSearch

## Import du jeu de données

Pour importer le jeu de données, complétez le script `import.js` (ici aussi, cherchez le `TODO` dans le code :wink:).

Exécutez-le ensuite :

```bash
npm install
node import.js
```

Vérifiez que les données ont été importées correctement grâce au shell (le nombre total de documents doit être `153194`) :

```
GET <nom de votre index>/_count
```

## Requêtes

À vous de jouer ! Écrivez les requêtes ElasticSearch permettant de résoudre les problèmes posés.

```
Mapping fields
PUT 911/_mapping/call
{
  "call": {
    "properties": {
      "category": {
        "type": "text",
        "fielddata": true
      },
      "source": {
        "properties": {
          "location": {
            "type": "geo_point"
          }
        }
      }
    }
  }
}

GET 911/call/_search
{
  "size": 0,
  "aggs": {
    "group_by_category": {
      "terms": {
        "field": "category.keyword"
      }
    }
  }
}

{
  "took": 14,
  "timed_out": false,
  "_shards": {
    "total": 5,
    "successful": 5,
    "failed": 0
  },
  "hits": {
    "total": 153194,
    "max_score": 0,
    "hits": []
  },
  "aggregations": {
    "group_by_category": {
      "doc_count_error_upper_bound": 0,
      "sum_other_doc_count": 0,
      "buckets": [
        {
          "key": "EMS",
          "doc_count": 75589
        },
        {
          "key": "Traffic",
          "doc_count": 54549
        },
        {
          "key": "Fire",
          "doc_count": 23056
        }
      ]
    }
  }
}


```

## Kibana

Dans Kibana, créez un dashboard qui permet de visualiser :

* Une carte de l'ensemble des appels
* Un histogramme des appels répartis par catégories
* Un Pie chart réparti par bimestre, par catégories et par canton (township)

Pour nous permettre d'évaluer votre travail, ajoutez une capture d'écran du dashboard dans ce répertoire [images](images).

### Timelion
Timelion est un outil de visualisation des timeseries accessible via Kibana à l'aide du bouton : ![](images/timelion.png)

Réalisez le diagramme suivant :
![](images/timelion-chart.png)

Envoyer la réponse sous la forme de la requête Timelion ci-dessous:  

```
TODO : ajouter la requête Timelion ici
```

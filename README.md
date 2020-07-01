# Express Server for ACIP Elasticsearch Instance

An [Express server](https://expressjs.com/) for our [Elasticsearch](https://www.elastic.co/) endpoints.

Routes are currently active for both the [ACE project](http://ace.asianclassics.org) and our [NLM collaboration](http://nlm.asianclassics.org). Our Elasticsearch instance is hosted on Elastic Cloud.

[Nginx](https://docs.nginx.com/nginx/admin-guide/web-server/reverse-proxy/) is being used as a reverse proxy.

[Logstash](https://www.elastic.co/guide/en/logstash/current/plugins-inputs-jdbc.html) pipelines load data from MySQL to Elasticsearch.

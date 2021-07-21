# TP_Paradigmas

Hasta ahora funciona de la siguiente forma:
- En una terminal correr el App.py (corriendo directamente el archivo .py)
- Por otra parte correr el mi_login.py, luego de haberse logeado se redirigirá al books.py (dónde está el ABM de libros)

Librerías necesarias para correrlo:
Tkinter (para trabajar con interfaces gráficas)
```
pip install tk
```

Flask (para levantar un server rápidamente)
```
pip install flask
```

Flask-SQLAlchemy (para establecer la configuración de la BD)
```
pip install -U Flask-SQLAlchemy
```

Flask-Marshmallow (biblioteca de serialización / deserialización de objetos)
```
pip install flask-marshmallow
```

Flask-CORS (permite la comunicación a través de métodos HTTP -> Create, Post, Delete, etc.)
```
pip install -U flask-cors
```

PyMySQL (para comunicar Python con MySQL)
```
pip install PyMySQL
```

Marshmallow-SQLAlchemy
```
pip install -U marshmallow-sqlalchemy
```

ttkbootstrap (Bootstrap para Tkinter -> mejorar interfaces)
```
pip install -U ttkbootstrap
```

**Para usar lo último (mongodb y react), complementar con lo siguiente**

## Ejecutar
```
1- pip install flask_mongoalchemy
2- pip install flask_jwt_extended
```
## Acceder a TP_Paradigmas\Frontend\client

Ejecutar por única vez
``` 
1-	npm install
2-	npm i @material-ui/core
3-	npm i react-router-dom
```

Para levantar el proyecto Ejecutar (previamente levantar mongod y correr el App.py)
```
npm start
```
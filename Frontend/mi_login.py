#IMPORTAMOS LIBRERÍAS NECESARIAS.
from tkinter import *
import os
import requests
import json


#CREAMOS VENTANA PRINCIPAL.
def ventana_inicio(registro_resulta):
    global ventana_principal, pestas_color
    pestas_color="DarkGrey"
    ventana_principal=Tk()
    ventana_principal.geometry("300x250") #DIMENSIONES DE LA VENTANA
    ventana_principal.title("Login con tkinter") #TITULO DE LA VENTANA
    Label(text="Escoja su opción", bg="LightGreen", width="300", height="2", font=("Calibri", 13)).pack() #ETIQUETA CON TEXTO
    Label(text="").pack()
    Button(text="Acceder", height="2", width="30", bg=pestas_color, command=login).pack() #BOTÓN "Acceder"
    Label(text="").pack()
    Button(text="Registrarse", height="2", width="30", bg=pestas_color, command=registro).pack() #BOTÓN "Registrarse".
    Label(text="").pack()
    Button(ventana_principal, text="Salir", width=10, height=1, bg=pestas_color, command = cerrarVentana_principal).pack()
    if registro_resulta == "Exitoso":
        Label(ventana_principal, text="¡¡¡Registro completado con éxito!!!", fg="green", font=("Arial", 12)).pack()
    else:
        Label(ventana_principal, text="").pack()
    ventana_principal.mainloop()

#CREAMOS VENTANA PARA REGISTRO.
def registro():
    ventana_principal.destroy()
    global ventana_registro
    ventana_registro =Tk()
    ventana_registro.title("Registro")
    ventana_registro.geometry("300x250")
 
    global nombre_usuario
    global clave
    global entrada_nombre
    global entrada_clave
    nombre_usuario = StringVar() #DECLARAMOS "string" COMO TIPO DE DATO PARA "nombre_usuario"
    clave = StringVar() #DECLARAMOS "sytring" COMO TIPO DE DATO PARA "clave"
 
    Label(ventana_registro, text="Introduzca datos", bg="LightGreen").pack()
    Label(ventana_registro, text="").pack()
    etiqueta_nombre = Label(ventana_registro, text="Nombre de usuario * ")
    etiqueta_nombre.pack()
    entrada_nombre = Entry(ventana_registro, textvariable=nombre_usuario) #ESPACIO PARA INTRODUCIR EL NOMBRE.
    entrada_nombre.pack()
    etiqueta_clave = Label(ventana_registro, text="Contraseña * ")
    etiqueta_clave.pack()
    entrada_clave = Entry(ventana_registro, textvariable=clave, show='*') #ESPACIO PARA INTRODUCIR LA CONTRASEÑA.
    entrada_clave.pack()
    Label(ventana_registro, text="").pack()
    Button(ventana_registro, text="Registrarse", width=10, height=1, bg="LightGreen", command = registro_usuario).pack() #BOTÓN "Registrarse"
    Button(ventana_registro, text="Cerrar", width=10, height=1, bg=pestas_color, command = cerrarVentana_registro).pack(pady=5)

    ventana_registro.mainloop()

#CREAMOS VENTANA PARA LOGIN.

def login():
    ventana_principal.destroy()
    global ventana_login
    ventana_login = Tk()
    ventana_login.title("Acceso a la cuenta")
    ventana_login.geometry("300x250")
    Label(ventana_login, text="Introduzca nombre de usuario y contraseña").pack()
    Label(ventana_login, text="").pack()
 
    global verifica_usuario
    global verifica_clave
 
    verifica_usuario = StringVar()
    verifica_clave = StringVar()
 
    global entrada_login_usuario
    global entrada_login_clave
 
    Label(ventana_login, text="Nombre usuario * ").pack()
    entrada_login_usuario = Entry(ventana_login, textvariable=verifica_usuario)
    entrada_login_usuario.pack()
    Label(ventana_login, text="").pack()
    Label(ventana_login, text="Contraseña * ").pack()
    entrada_login_clave = Entry(ventana_login, textvariable=verifica_clave, show= '*')
    entrada_login_clave.pack()
    Label(ventana_login, text="").pack()
    Button(ventana_login, text="Acceder", width=10, height=1, command = verifica_login).pack()
    Button(ventana_login, text="Cancelar", width=10, height=1, bg=pestas_color, command = cerrarVentana_login).pack(pady=5)
    ventana_login.mainloop()

#VENTANA "VERIFICACION DE LOGIN".

def verifica_login():
    usuario1 = verifica_usuario.get()
    clave1 = verifica_clave.get()

    entrada_login_usuario.delete(0, END) #BORRA INFORMACIÓN DEL CAMPO "Nombre usuario *" AL MOSTRAR NUEVA VENTANA.
    entrada_login_clave.delete(0, END) #BORRA INFORMACIÓN DEL CAMPO "Contraseña *" AL MOSTRAR NUEVA VENTANA.
 
    if findUserByNameAndPasswor(usuario1, clave1) :
        acceso_al_ABM_books()
    else :
        no_usuario()
 
#VENTANA DE "Usuario no encontrado".

def no_usuario():
    global ventana_no_usuario
    ventana_no_usuario = Toplevel(ventana_login)
    ventana_no_usuario.title("ERROR")
    ventana_no_usuario.geometry("200x100")
    Label(ventana_no_usuario, text="Usuario o contraseña incorrecta").pack()
    Button(ventana_no_usuario, text="OK", command=borrar_no_usuario).pack() #EJECUTA "borrar_no_usuario()"

#CERRADO DE VENTANAS

def borrar_exito_login():
    ventana_exito.destroy()
 
def borrar_no_clave():
    ventana_no_clave.destroy()
 
 
def borrar_no_usuario():
    ventana_no_usuario.destroy()

def cerrarVentana_login():
    ventana_login.destroy()
    ventana_inicio("")

def cerrarVentana_principal():
    ventana_principal.destroy()

def cerrarVentana_registro(registro_resulta=""):
    ventana_registro.destroy()
    ventana_inicio(registro_resulta)

#traemos el use por name y password
def findUserByNameAndPasswor(var_name, var_password):
    url = 'http://localhost:4000/api/v1/users/check/'+str(var_name)+'/'+str(var_password)
    return requests.get(url).json()

#traemos el use por name
def findUserByName(var_name):
    url = 'http://localhost:4000/api/v1/users/check/'+str(var_name)
    return requests.get(url).json()

#va al otro archivo
def acceso_al_ABM_books():
    ventana_login.destroy() #cierro el login sin abrir la principal
    import books

#REGISTRO USUARIO
 
def registro_usuario():
 
    usuario_info = nombre_usuario.get()
    clave_info = clave.get()
    if(findUserByName(usuario_info)):
        Label(ventana_registro, text="No registrado, porque ya existe el usuario", fg="red", font=("calibri", 11)).pack()
    else:
        url = 'http://localhost:4000/api/v1/users'

        response = requests.post(url, json={'name': usuario_info, 'password': clave_info}) 

        entrada_nombre.delete(0, END)
        entrada_clave.delete(0, END)

        if 'error' in response.json(): 
            Label(ventana_registro, text=response.json()['error'], fg="red", font=("calibri", 11)).pack()
        else :
            cerrarVentana_registro("Exitoso")
        

ventana_inicio("")  #EJECUCIÓN DE LA VENTANA DE INICIO.


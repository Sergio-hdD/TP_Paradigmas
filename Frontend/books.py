from tkinter import*
from tkinter import ttk #Es dónde está la tabla
from tkinter import messagebox #Sirve para mostrar mensajes
import requests
import json
from ttkbootstrap import Style

def mostrarDatos(objetoABuscar = {}): #Al ponerlo así el parámetro es opcional, es decir si en algún lado no se lo pasa no tira error y estará vacio 
    url = 'http://localhost:4000/api/v1/books'
    books = requests.get(url).json() 
    for book in books:
        tabla.insert('', 0, text = book['title'], values = (book['description'], book['price']) )

def buscarYMostrarLibro():
    title = buscarPorTitle.get() 
    if len(title) == 0 :
        messagebox.showerror(message = "Debe ingresar el título para realizar la búsqueda")
    else: #Si se ingresa el título     
        limparPantalla()
        limpiarInputs()
        book_in_json = findBookByTitle(title)
        tabla.insert('', 0, text = book_in_json['title'], values = (book_in_json['description'], book_in_json['price']) )
        global botonVerTodos #Lo declaro global para que entre acá y la inicializo más arriba None para poder usarla en "traerTodosLosLibros()" para ocultar este botón    
        botonVerTodos = Button(ventana,text = "Ver todos", command = traerTodosLosLibros, bg = "green", fg = "brown", bd=6, font="Verdana")
        botonVerTodos.grid(row = 13, columnspan = 2, sticky = E, padx=10)
        return 0


def traerTodosLosLibros():
    limpiarInputsBuscar()
    textoInformativoEnBuscador()
    limparPantalla()
    mostrarDatos()
    #Si no usaba una variable global no me dejaba ocultar el botón ya que lo creo en una función interna
    global botonVerTodos #Lo declaro global y la inicializo más arriba None luego la cargo (en "buscarYMostrarLibro()" )con el botón para poder usarla acá para ocultar este botón
    botonVerTodos.grid_forget() #grid_forget() oculta el boton, destroy() lo borra, también pack_forget() lo oculta pero debe usarse así "command=lambda: self.label.pack_forget()" (sin comillas) en los parámetros de un botón que lo active  
    return 0
    
def limparPantalla():
    for registro in tabla.get_children():
        tabla.delete( registro )  #Borro cada registro que se está mostrando en la tabla

def crearInputAndLabel(texto, var_row, label_padx, label_pady, label_ipadx, label_ipady, input_padx, input_pady, input_ipadx, input_ipady, flag_texto):
    # sticky es la alineación, ipadx e ipady tamaño, padx e pady son el pading desde el lado que se alinea con sticky 
    Label(ventana, text = texto ).grid(row = var_row, column=0, sticky=W, padx=label_padx, pady=label_pady, ipadx=label_ipadx, ipady=label_ipady)
    if flag_texto == "texto":
        var_entry = Text(ventana, width=20, height=6) #Va a estar en la ventana
    else:
        var_entry = Entry(ventana) #Va a estar en la ventana
    var_entry.grid(row=var_row, columnspan=2, sticky=W, ipadx=input_ipadx, ipady=input_ipady, padx= input_padx, pady=input_pady)
    return var_entry

def limpiarInputsBuscar(): #Saca de los input que fueron usados para buscar al tocar el boton 
    buscarPorTitle.delete(0, END) #Borra el input de inicio a fin

def limpiarInputs(): #Saca de los input que fueron agregados al tocar el boton "Agregar libro" 
    title.delete(0, END) #Borra el input de inicio a fin
    description.delete("1.0","end") #Borra el input de inicio a fin, es dististo porque es una caja de texto
    price.delete(0, END)

def cargarInputs(book_in_json_format): 
    title.insert(0,book_in_json_format["title"]) #Inserto desde el inicio ("0") el campo del book_in_json_format que coincida con el texto
    description.insert("1.0",book_in_json_format["description"]) #es dististo porque es una caja de texto
    price.insert(0,book_in_json_format["price"])

def agregarLibro():
    if len(title.get()) != 0 and len(description.get("1.0","end")) != 0 and len(price.get()) != 0 : #Si se cargaron todos los campos
        if findBookByTitle(title.get()):
            messagebox.showerror(message = "No puede rigistrar con un título que ya existe")
        else:
            try:
                aggregate_book()
                messagebox.showinfo(message="El libro se ha guardado correctamente", title="Guardado")
                limpiarInputs()
                limparPantalla() #Saco lo que se estaba mostrando en la tabla
                mostrarDatos() #Recargo para ver tambien lo último agregado
            except: #Si no se puede conectar
                print("Algo falló al intentar insertar")
    else:
        messagebox.showerror(message = "No puede haber campos vacios")

def editarLibro():
    global title__a_buscar #Lo declaro global para que entre acá y la inicializo más arriba como string vacío para poder usarla en otros lados
    if len(title.get()) != 0 and len(description.get("1.0","end")) != 0 and len(price.get()) != 0 : #Si se cargaron todos los campos
        try:
            update_book(findBookByTitle(title__a_buscar)['id'])
            limpiarInputs()
        except: #Si no se puede conectar
            print("Algo falló al intentar actualizar ")
    else:
        messagebox.showerror(message = "No puede haber campos vacios")
    limparPantalla() #Saco lo que se estaba mostrando en la tabla
    mostrarDatos() #Recargo para ver tambien lo último agregado 
    editar["state"] = "disabled" #cuando se de clic en el botón editar (es como llega acá) el estado del botón editar será disabled
    borrar["state"] = "disabled"
    agregar["state"] = "normal"

def borrarLibro():
    global title__a_buscar #Lo declaro global para que entre acá y la inicializo más arriba como string vacío para poder usarla en otros lados
    delete_book_by_id(findBookByTitle(title__a_buscar)['id'])
    limpiarInputs()
    limparPantalla() #Saco lo que se estaba mostrando en la tabla
    mostrarDatos() #Recargo para ver tambien lo último agregado 
    borrar["state"] = "disabled" #cuando se de clic en el botón editar (es como llega acá) el estado del botón editar será disabled
    editar["state"] = "disabled"
    agregar["state"] = "normal"

def dobleClicTabla(envent):
    global title__a_buscar #Lo declaro global para que entre acá y la inicializo más arriba como string vacío para poder usarla en otros lados 
    title__a_buscar = str(tabla.item(tabla.selection())["text"]) #obtengo el item de la tabla que fue seleccionado y de este solo el titulo, convierto a es string aunque ya esta en string (por las dudas)
    book_in_json_format = findBookByTitle(title__a_buscar) 
    limpiarInputs()
    cargarInputs(book_in_json_format)
    agregar["state"] = "disabled" #cuando se de doble clic en la tabla (es como llega acá) el estado del botón agregar será disabled
    editar["state"] = "normal"
    borrar["state"] = "normal"

def findBookByTitle(variable_titulo):
    url = 'http://localhost:4000/api/v1/books/ByTitle/'+variable_titulo
    return requests.get(url).json()

def delete_book_by_id(var_id):
    url = 'http://localhost:4000/api/v1/books/'+str(var_id)
    return requests.delete(url).json()

def update_book(var_id):
    url = 'http://localhost:4000/api/v1/books/'+str(var_id)
    return requests.put(url, json={'title': title.get(), 'description': description.get("1.0","end"), 'price' : price.get()}).json()

def aggregate_book():
    url = 'http://localhost:4000/api/v1/books'
    response = requests.post(url, json={'title': title.get(), 'description': description.get("1.0","end"), 'price' : price.get()}) 
    
    if 'error' in response.json(): 
        Label(ventana, text=response.json()['error'], fg="red", font=("calibri", 11)).pack()

def limpiarBuscadorPostFocusIn(self):
    if buscarPorTitle:
        buscarPorTitle.delete(0, END)

def textoInformativoEnBuscador():
    buscarPorTitle.insert(0, 'Ingrese aquí el título del libro que quiere buscar...')
    buscarPorTitle.bind('<FocusIn>', limpiarBuscadorPostFocusIn)

def buscador():
    global buscarPorTitle, buscar
    #Buscar por title
    Label(ventana, text = "buscar por título" ).grid(row = 1, sticky=W, padx=250, pady=5)
    buscarPorTitle = Entry(ventana) #Va a estar en la ventana
    textoInformativoEnBuscador()
    buscarPorTitle.grid(row=2, column=0, sticky=W, padx=10, pady=5, ipadx=190, ipady=5)
    buscar = Button(ventana,text = "Buscar", command = buscarYMostrarLibro, bg = "blue", fg = "white", bd=2, font="Verdana") 
    buscar.grid(row = 2, columnspan = 2, sticky=E, padx=10, pady=5)

def tabla():
    global tabla
    tabla = ttk.Treeview(ventana, columns = ("#1", "#2")) #(Especifico el identificador de cada header [salvo el primero que se agrega solo]) Treeview es una tabla en forma de árbol pero la voy a usar comol tabla común (primer parámetro es dónde va a estar la tabla, el segundo parámetro es cantidad de columnas que quiero que tenga) 
    tabla.grid(row = 5, column = 0, columnspan = 2) #Creo una grila en la fila 1, columna 0 y que abarque 2 columnas 
    tabla.heading("#0",text = "Título", anchor = W)
    tabla.heading("#1",text = "Descripción", anchor = W)
    tabla.heading("#2",text = "Precio", anchor = W)
    tabla.bind("<Double-Button-1>", dobleClicTabla) #Cuando se da doble clic llama a la función, <Button-1> para 1 clic y <Double-Button-1> para doble clic, (con el 1 toma el botón izquierdo del mouse, <Button-2> el derecho y <Button-3> el scroll)
    #Hecho con doble clic ya que si lo hago con un clic, por ejemplo si tengo A y B, al hacer clic en A y luego clic en B toma el valor pero de A (es decir en el segundo clic tama el primero)... pidiendo doble clic para elegir, se evita esto

def inputs():
    global title, description, price
    #Título
    #title = crearInputAndLabel("Título", 9, 5, 5, 20, 8, 100, 5, 200, 4, "")
    Label(ventana, text = "Título:").grid(row=9, columnspan=2 ,sticky=W, padx=10, pady=5)  
    title = Entry(ventana) #Va a estar en la ventana
    title.grid(row=9, column=0, sticky=E, padx=10, pady=5, ipadx=200, ipady=5)
    title.focus() #Para que cuando inicie la ventana el cursor esté en este campo de texto

    #Descripción
    #description = crearInputAndLabel("Descripción", 9, 5, 5, 20, 8, 100, 5, 200, 10, "texto")
    Label(ventana, text = "Descripción:").grid(row=10, columnspan=2 ,sticky=W, padx=10, pady=5)  
    description = Text(ventana, width=15, height=4) 
    description.grid(row=10, column=0, sticky=E, padx=10, pady=5, ipadx=200, ipady=5)

    #Precio
    #price = crearInputAndLabel("Precio", 10, 20, 5, 20, 8, 100, 5, 70, 4, "")
    Label(ventana, text = "Precio:").grid(row=11, columnspan=2 ,sticky=W, padx=10, pady=5)  
    price = Entry(ventana) 
    price.grid(row=11, column=0, sticky=W, padx=90, pady=5, ipadx=70, ipady=5)

def botonesABM():
    global agregar, editar, borrar
    #Botón agregar
    agregar = Button(ventana,text = "Agregar", command = agregarLibro, bg = "green", fg = "white", bd=2, font="Verdana") #Command llama a la función al tocar el botón, bg es el fondo, fg la letra 
    agregar.grid(row = 13, column=0, sticky=W, padx= 180, pady=5)   

    #Botón editar 
    editar = Button(ventana,text = "Editar", command = editarLibro, bg = "yellow", bd=2, font="Verdana") 
    editar.grid(row = 13, column=0, sticky=W, padx= 280, pady=5) 
    editar["state"] = "disabled" #El botón arranca en estado disabled

    #Botón borrar 
    borrar = Button(ventana,text = "Borrar", command = borrarLibro, bg = "red", fg = "white", bd=2, font="Verdana") 
    borrar.grid(row = 13, columnspan = 2, sticky=E, padx= 180, pady=5)
    borrar["state"] = "disabled" #El botón arranca en estado disabled

def mensajes_y_espacios():
    Label(ventana, text = "" ).grid(row = 3)
    Label(ventana, text = "Con doble clic selecione uno de la lista para realizar las aciones que indican los botones inferiores." ).grid(row = 4, column=0, sticky=W+E, pady=5)
    Label(ventana, text = "" ).grid(row = 6)
    Label(ventana, text = "Para registrar un libro llene los campos, luego pulse el botón \"Agregar\"" ).grid(row = 7, column=0, sticky=W+E)
    Label(ventana, text = "Para editar o borar, selecione uno de la lista, luego pulse el botón correspondiente" ).grid(row = 8, column=0, sticky=W+E)
    Label(ventana, text = "" ).grid(row = 12)

# Evento de cierre de interfaz
def close_window():
    if messagebox.askokcancel("Salir", "Va a salir de la aplicación"):
        ventana.destroy()


def main_books():
    global ventana
    style = Style()    
    ventana = style.master #Creo una ventana
    #ventana.geometry("900x520")  # tamaño de la ventana: en este caso no me sirve darle tamaño fijo ya que se agregan o se esconde un botón 
    # anula la opción de máximizar y de cambiar el tamaño arrastrando con el puntero del mouse
    ventana.resizable(width=0, height=0)
    #ventana.configure(background="lawn green")  # fondo de color sólido
    ventana.title("ABM de Libros")  # título
    # ventana.iconbitmap("/Icono.ico")  # ícono
    # si se preciona la "X" para cerrar la app, llamo a close_window que pide confirmar
    ventana.protocol("WM_DELETE_WINDOW", close_window)

    buscador()
    mensajes_y_espacios()
    tabla()
    inputs()
    botonesABM()

    mostrarDatos()
    ventana.mainloop() #Ciclo principal

main_books()
from tkinter import*
from tkinter import ttk #Es dónde está la tabla
from tkinter import messagebox #Sirve para mostrar mensajes
import requests
import json
from ttkbootstrap import Style
from tkinter import scrolledtext

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
        editar["state"] = "disabled" #como limpio los input no hay nada para actualizar o borrar y habilito para que pueda dar de alta
        borrar["state"] = "disabled"
        agregar["state"] = "normal"

        book_in_json = findBookByTitle(title)
        tabla.insert('', 0, text = book_in_json['title'], values = (book_in_json['description'], book_in_json['price']) )
        botonVerTodos["state"] = "normal"
        editar["state"] = "disabled"
        borrar["state"] = "disabled"
        return 0


def traerTodosLosLibros():
    limpiarInputsBuscar()
    limpiarInputs()
    textoInformativoEnBuscador()
    limparPantalla()
    botonVerTodos["state"] = "disabled"
    mostrarDatos()
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
    Label(ventana, text = "buscar por título", bg=color_ventana).pack(padx=250, pady=5)
    buscarPorTitle = Entry(ventana) #Va a estar en la ventana
    textoInformativoEnBuscador()
    buscarPorTitle.pack(ipadx=210, ipady=5)
    buscar = ttk.Button(ventana, text="Buscar", style='primary.TButton', command = buscarYMostrarLibro).pack(pady=5)

def tabla():
    global tabla
    tabla = ttk.Treeview(ventana, columns = ("#1", "#2")) #(Especifico el identificador de cada header [salvo el primero que se agrega solo]) Treeview es una tabla en forma de árbol pero la voy a usar comol tabla común (primer parámetro es dónde va a estar la tabla, el segundo parámetro es cantidad de columnas que quiero que tenga) 
    tabla.pack()  
    tabla.heading("#0",text = "Título", anchor = W)
    tabla.heading("#1",text = "Descripción", anchor = W)
    tabla.heading("#2",text = "Precio", anchor = W)
    tabla.bind("<Double-Button-1>", dobleClicTabla) #Cuando se da doble clic llama a la función, <Button-1> para 1 clic y <Double-Button-1> para doble clic, (con el 1 toma el botón izquierdo del mouse, <Button-2> el derecho y <Button-3> el scroll)
    #Hecho con doble clic ya que si lo hago con un clic, por ejemplo si tengo A y B, al hacer clic en A y luego clic en B toma el valor pero de A (es decir en el segundo clic tama el primero)... pidiendo doble clic para elegir, se evita esto
    
def inputs():
    global title, description, price
    #Título
    #title = crearInputAndLabel("Título", 9, 5, 5, 20, 8, 100, 5, 200, 4, "")
    Label(ventana, text = "Título:", font=("Arial Black", 12), bg=color_ventana).pack()  
    title = Entry(ventana) #Va a estar en la ventana
    title.pack(ipadx=210, ipady=5)
    title.focus() #Para que cuando inicie la ventana el cursor esté en este campo de texto

    #Descripción
    #description = crearInputAndLabel("Descripción", 9, 5, 5, 20, 8, 100, 5, 200, 10, "texto")
    Label(ventana, text = "Descripción:", font=("Arial Black", 12), bg=color_ventana).pack()  
    description = Text(ventana, width=15, height=3) 
    description.pack(ipadx=225, ipady=5)

    #Precio
    #price = crearInputAndLabel("Precio", 10, 20, 5, 20, 8, 100, 5, 70, 4, "")
    Label(ventana, text = "Precio:", font=("Arial Black", 12), bg=color_ventana).pack()  
    price = Entry(ventana) 
    price.pack(ipadx=70, ipady=5)

def botonesABM():
    global agregar, editar, borrar
    #Botón agregar
    agregar = ttk.Button(ventana, text="Guardar", style='success.Outline.TButton',  command = agregarLibro)
    #agregar = ttk.Button(ventana, text="Guardar", style='success.TButton',  command = agregarLibro)
    agregar.pack(side='left', padx=100, pady=10)
    #Botón editar
    editar = ttk.Button(ventana, text="Editar", style='warning.Outline.TButton',  command = agregarLibro)
    #editar = ttk.Button(ventana, text="Editar", style='warning.TButton',  command = agregarLibro)
    editar.pack(side='left', padx=0, pady=10)
    editar["state"] = "disabled" #El botón arranca en estado disabled
    #Botón borrar 
    borrar = ttk.Button(ventana, text="Borrar", style='danger.Outline.TButton', command = borrarLibro)
    #borrar = ttk.Button(ventana, text="Borrar", style='danger.TButton', command = borrarLibro)
    borrar.pack(side='left', padx=100, pady=10)
    borrar["state"] = "disabled" #El botón arranca en estado disabled

def crear_botonVerTodos():
    #Botón ver todos
    global botonVerTodos 
    botonVerTodos = ttk.Button(ventana, text="Recargar todos", style='success.Outline.TButton', command=traerTodosLosLibros)
    botonVerTodos.pack(pady=5)
    botonVerTodos["state"] = "disabled" #El botón arranca en estado disabled

# Evento de cierre de interfaz
def close_window():
    if messagebox.askokcancel("Salir", "Va a salir de la aplicación"):
        ventana.destroy()


def main_books():
    global ventana, color_ventana
    style = Style()    
    ventana = style.master #Creo una ventana
    color_ventana = "#d3eaf2" 
    #ventana.geometry("900x520")  # tamaño de la ventana: en este caso no me sirve darle tamaño fijo ya que se agregan o se esconde un botón 
    # anula la opción de máximizar y de cambiar el tamaño arrastrando con el puntero del mouse
    ventana.resizable(width=0, height=0)
    ventana.configure(background=color_ventana)  # fondo de color sólido
    ventana.title("ABM de Libros")  # título
    # ventana.iconbitmap("/Icono.ico")  # ícono
    # si se preciona la "X" para cerrar la app, llamo a close_window que pide confirmar
    ventana.protocol("WM_DELETE_WINDOW", close_window)
    buscador()    
    Label(ventana, text = "", bg=color_ventana).pack()
    Label(ventana, text = "Con doble clic selecione uno de la lista para realizar las aciones que indican los botones inferiores.", font=("Arial Narrow", 12), bg=color_ventana).pack()
    tabla()
    crear_botonVerTodos()
    Label(ventana, text = "", bg=color_ventana).pack()
    Label(ventana, text = "Para registrar un libro llene los campos, luego pulse el botón \"Agregar\"", font=("Calibri Cuerpo", 10), bg=color_ventana).pack()
    Label(ventana, text = "Para editar o borar, selecione uno de la lista, luego pulse el botón correspondiente", font=("Calibri Cuerpo", 10), bg=color_ventana).pack()
    inputs()
    Label(ventana, text = "", bg=color_ventana).pack()
    botonesABM() 
    mostrarDatos()

    ventana.mainloop() #Ciclo principal

main_books()

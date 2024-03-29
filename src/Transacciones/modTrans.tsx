import ApliModal from "../ApliModal";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ErrorCuenta } from "../Errores/ErrorCuenta";
import { ErrorTransacciones } from "../Errores/ErrorTransacciones";
import {Validacion} from '../Validaciones';

const validationsForm = (form: any)=>{
    let errors = {fecha:'',mensaje:'',monto:''};
    let resName = "^[A-ZÑa-zñáéíóúÁÉÍÓÚ'° ]+$";
    let resMonto = "^[0-9]+$";
    let resCantMonto = "^.{0,9}$"
    let resFecha = /^(?:(?:(?:0?[1-9]|1\d|2[0-8])[/](?:0?[1-9]|1[0-2])|(?:29|30)[/](?:0?[13-9]|1[0-2])|31[/](?:0?[13578]|1[02]))[/](?:0{2,3}[1-9]|0{1,2}[1-9]\d|0?[1-9]\d{2}|[1-9]\d{3})|29[/]0?2[/](?:\d{1,2}(?:0[48]|[2468][048]|[13579][26])|(?:0?[48]|[13579][26]|[2468][048])00))$/
    
    if (!form.mensaje){
        errors.mensaje = '*El campo descripcion es requerido';
    } else if (!(form.mensaje).match(resName)){
        errors.mensaje = '*El campo solo acepta letras';
    }

    if (!form.monto){
        errors.monto = '*El campo monto es requerido';
    } else if (!(form.monto).match(resMonto)){
        errors.monto = '*El campo solo acepta numeros positivos';
    } else if (!(form.monto).match(resCantMonto)){
        errors.monto = '*El campo solo acepta hasta 9 digitos';
    }

    if (!form.fecha){
        errors.fecha = '*El campo fecha es requerido'
    } else if (!(form.fecha).match(resFecha)){
        errors.fecha = '*El formato de fecha es invalido';
    }

    return errors;
}

const initialForm = {
    fecha:'',
    mensaje:'',
    tipo:'',
    monto:'',
    cuenta: ''
};

const style = {
    color: 'red',
    fontSize: '15px'

}

export default function MenuModTrans() {

    const {form,errors,handleChange,handleBlur} = Validacion(initialForm,validationsForm);
    const [modal,setModal]=useState(0);
    const nav = useNavigate();
    const goHome = () => { nav('/transacciones') };
    let showCond = 0;
    let showOp = 0;
    let keyObj = "";
    let cond = 0;
    let objModded = {"monto":"0","descripcion":"emp","fecha":"28/10/2022","tipo":"Ingreso","cuenta":"Mercantil"}

    const showOption = ( e: { target: { value: any; }; } ) => {
        let key = e.target.value;
        let obj = JSON.parse( "" + localStorage.getItem(key) );
        let div = document.getElementById("card");
        objModded = obj;
        keyObj = key;

        let p = [ 
            document.createElement("p"), document.createElement("p"),
            document.createElement("p"), document.createElement("p"),
            document.createElement("p"),
        ];
        
        let cuenta = document.createTextNode( "Cuenta de Banco: " + obj.cuenta );
        let tipo = document.createTextNode( "Tipo de Transaccion: " + obj.tipo );
        let monto = document.createTextNode( "Monto: $" + obj.monto );
        let desc = document.createTextNode( "Descripcion: " + obj.descripcion );
        let fecha = document.createTextNode( "Fecha: " + obj.fecha );
        
        p[0].appendChild(cuenta);
        p[1].appendChild(tipo);
        p[2].appendChild(monto);
        p[3].appendChild(desc);
        p[4].appendChild(fecha);
        
        if ( showCond == 0 ) { showCond = 1; }
        else { div?.replaceChildren(); }
        for ( let i = 0; i <= 4; i++ ) { div?.appendChild(p[i]); }
    }

    const handleInputMonto = (e: { target: { value: any; }; }) => {
        let text = e.target.value;
        objModded.monto = text;
        form.monto = text;
    }
    const handleInputFecha = (e: { target: { value: any; }; }) => {
        let text = e.target.value;
        objModded.fecha = text;
        form.fecha = text;
    }
    const handleInputCuenta = (e: { target: { value: any; }; }) => {
        let txt = e.target.value;
        objModded.cuenta = txt;
        form.cuenta = txt;
    }
    const handleInputDesc = (e: { target: { value: any; }; }) => {
        let text = e.target.value;
        objModded.descripcion = text;
        form.descripcion = text;
    }
    const handleInputTipo = (e: { target: { value: any; }; }) => {
        let text = e.target.value;
        objModded.tipo = text;
        form.tipo = text;
    }

    const modFunction = () => {
        if ( keyObj != "null" && errors.monto =='' && errors.fecha == '' && errors.mensaje == '') { 
            localStorage.setItem( keyObj, JSON.stringify(objModded) );
            setModal(1);
        }
    }

    const reset = ()=>{
        if (modal==2){
            window.location.reload();
        }
    }

    function Options() {
        if ( cond == 0 ) {
            let doc = document.getElementById("transacciones");
            let keys = Object.keys(localStorage);
            for(let key of keys) {
                if ( key.includes("transaccion-") == true ) {
                    let option = document.createElement("option");
                    let ob = JSON.parse( "" + localStorage.getItem( key ) );
                    option.value = key;
                    option.text = ( 
                        ob.cuenta + ", " +
                        ob.tipo + ", " +
                        ob.descripcion + ", $" +
                        ob.monto + ", " +
                        ob.fecha
                    );
                    doc?.appendChild(option);
                }  
            }             
            cond = 1
        }
    }
    
    function optionsAccounts() {
        if ( showOp == 0 ) {
            let doc = document.getElementById("cuenta");
            let keys = Object.keys(localStorage);
            for(let key of keys) {
                if ( key.includes("cuenta-") == true ) {
                    let option = document.createElement("option");
                    let ob = JSON.parse( "" + localStorage.getItem( key ) );
                    option.value = key;
                    option.text = ( 
                        ob.NombreBanco + ", " +
                        ob.NumeroCuenta + ", " +
                        ob.TipoCuenta + ", $" +
                        ob.Saldo + ", "
                    );
                    doc?.appendChild(option);
                }  
            }             
            showOp = 1
        }
    }

    return (     
        <>
        {ErrorCuenta()}
        {ErrorTransacciones()}
            <div className="bg">
            <div className="mainMod">
                <h1>Modificar Transacciones</h1>
                    <p id="mainP">
                        Elige una Transaccion a Modificar:
                        <br/>
                        <select id="transacciones" onClick={ Options } onChange={ showOption } >
                            <option value="null" >Seleccione una Transaccion</option>
                        </select>
                        <div id="card" className="card">
                        </div>
                    </p>

                    <p>
                        Elige una Cuenta de Banco: <br/>
                        <select id="cuenta" onChange={ handleInputCuenta } onClick={ optionsAccounts } > 
                            <option value="null" >Cuenta de Banco</option>
                        </select>
                    
                        <br/> <br/> Elige el tipo de Transaccion: <br/>
                        <select id="tipo" onChange={ handleInputTipo } >
                            <option value="null" >Tipo de Transaccion</option>
                            <option value="Ingreso" >Ingreso</option>
                            <option value="Gasto" >Gasto</option>
                        </select>
                    
                        <br/> <br/> Ingrese un Monto <br/>
                        <input type="number" placeholder="Numero" name='monto' onChange={ handleInputMonto } onBlur={handleBlur} autoFocus/>
                        {errors.monto && <p style={style}>{errors.monto}</p>}
                        <br/> <br/> Ingrese la fecha de la Transaccion <br/>
                        <input type="text" placeholder="Fecha" name='fecha' onChange={ handleInputFecha } onBlur={handleBlur}/>
                        {errors.fecha && <p style={style}>{errors.fecha}</p>}
                    
                        <br/> <br/> Añade una Descripcion <br/>
                        <textarea name="mensaje" placeholder="Describa" onChange={ handleInputDesc } onBlur={handleBlur} ></textarea>
                        {errors.mensaje && <p style={style}>{errors.mensaje}</p>}
                        <br/> <br/>
                    </p>

                <button onClick={ goHome } className="glow-button" >Regresar</button>
                <input type="submit" value="Confirmar" className="glow-button" onClick={ modFunction } />
            </div>
            </div>
            {ApliModal('/transacciones','Modificar Transacciones','Menu de Transacciones','Modificar otra Transaccion','Exito!','Se ha realizado la transaccion con exito',modal,setModal)}
            {reset()}
        </>
    );
}
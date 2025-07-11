import React from 'react';

import { MenuButton, Button1, ListCheckedBox, InputText, InputCheck } from "./components/Buttons";
import { GraphObject } from "../engine/engineComponents/GraphObject.ts";
import Swal from 'sweetalert2';


class Property extends React.Component{
  constructor(props){
    super(props);
    this.inputRef = {}
    this.checkNullRef = null
    this.checkFunctionRef = {}

    this.isNull = this.props.defaultValue==null;
  }
  render(){
    const object = this.props.object;
    const type = this.props.type;
    const key = this.props.keyd;
    const defaultValue = this.props.defaultValue;
    
    const change = (e)=>{
      if(type.includes("number")){
        if(isNaN(e)){
          return;
        }
        e *= 1;
      }
      object[key] = e;
      this.forceUpdate();
    }
    
    return(
        <div className='flex'>
          <div className='w-48'>{key}</div>
          {type == "boolean"?
            <InputCheck
              defaultValue={defaultValue}
              action={(e)=>{
                change(e);
              }}
              label={defaultValue}
            />
            :
            <InputText 
            type={type=="number"? "number" : "text"}
            defaultValue={defaultValue}
            action={(e)=>{
              change(e);
              this.isNull = false;
              if(this.checkNullRef != null){
                this.checkNullRef.checked = false;
                this.checkNullRef.forceUpdate();
              }
            }}
            selfSet={(e)=>{this.inputRef = e}}
            />
          }
          {type.includes("null") ? 
            <InputCheck 
              label="isNull" 
              checked={defaultValue==null}
              selfSet={(e)=>{this.checkNullRef = e}}
              action={(e)=>{
                if(e){
                  this.isNull = true;
                  this.inputRef.val("");
                  change(null);
                }
              }}/>
          : <></>}
        </div>
    );
  }
}
class ObjectsE extends React.Component {
  constructor(props){
    super(props);
    this.object = new GraphObject();
    this.selectedObject = "";
    this.hoveredObject = "";
    this.mounted = false;
    this.hide = false;
    this.showStates = false;
    this.keys = 0;
    this.value = "";
  }
  componentDidMount(){
    if(!this.mounted){
      this.mounted = true;
      this.props.selfRef(this);
      const engine = this.props.engine;
      engine.drawObjectLimits = true;
    }
  }
  objectsList(){
    const engine = this.props.engine;
    const reRender = this.props.reRender;
    let objects = engine.graphArray.objects;
    return(
      objects.map((graphObject)=>(

        <Button1 text={graphObject.id} 
          color={graphObject.enabled ? undefined : "bg-orange-400"}
          action={()=>{
            engine.objectsToDebug = [graphObject.id];
            reRender();
            this.selectedObject = graphObject.id;
            this.forceUpdate();
          }}
          enter={()=>{
            this.hoveredObject = graphObject.id;
            engine.objectsToDebug = [this.selectedObject, graphObject.id];
            reRender();
          }}
          leave={()=>{
            this.hoveredObject = "";
            engine.objectsToDebug = [this.selectedObject];
            reRender();
          }}
        />
        ))
    );
  }
  listProperties(){
    if(this.selectedObject != ""){
      const engine = this.props.engine;
      let types;
      try {
        types = engine.graphArray.get(this.selectedObject).dataType;  
      } catch (error) {
        this.selectedObject = "";
        return;
      }
      const obj = engine.graphArray.get(this.selectedObject);
      const objInfo = obj.dump();

      return(
        Object.keys(objInfo).map(key=>(
            <Property
              object={obj}
              key={Math.random()+window.performance.now()}
              keyd={key}
              type={types[key]}
              defaultValue={objInfo[key]}
            />
          ))
      );
    }
  }
  creationButton(){
        const eng = this.props.engine;
    return <Button1 
              text="create"
              action={()=>{
                Swal.fire({
                  text: "GraphObject id: ",
                  showDenyButton: false,
                  showConfirmButton: true,
                  confirmButtonColor:"green",
                  showCancelButton: true,
                  confirmButtonText: "Crear",
                  cancelButtonText: "Cancelar",
                  input:"text"
                }).then((result) => {
                  if (result.isConfirmed && result.value != "") {
                    eng.graphArray.push(new GraphObject({id:result.value, enabled:true}));
                  }
                });
              }}
              />
  }
  cloneButton(){
    const eng = this.props.engine;
    return <Button1 
              text="clone"
              action={()=>{
                Swal.fire({
                  text: "GraphObject id to clone: ",
                  showDenyButton: false,
                  showConfirmButton: true,
                  confirmButtonColor:"green",
                  showCancelButton: true,
                  confirmButtonText: "Clonar",
                  cancelButtonText: "Cancelar",
                  input:"text"
                }).then((targetId) => {
                  if (targetId.isConfirmed && targetId.value != "") {
                    if(!eng.graphArray.exist(targetId.value)){
                      Swal.fire({
                        title: 'Error!',
                        text: 'No existe un GraphObject con tal id',
                        icon: 'error',
                        confirmButtonText: 'Cool'
                      })
                    }else{
                      Swal.fire({
                        text: "GraphObject id for the clone: ",
                        showDenyButton: false,
                        showConfirmButton: true,
                        confirmButtonColor:"green",
                        showCancelButton: true,
                        confirmButtonText: "Clonar",
                        cancelButtonText: "Cancelar",
                        input:"text"
                      }).then((cloneId) => {
                        if (cloneId.isConfirmed && cloneId.value != "") {
                          if(eng.graphArray.exist(cloneId.value)){
                            Swal.fire({
                              title: 'Error!',
                              text: 'Ya existe un GraphObject con tal id',
                              icon: 'error',
                              confirmButtonText: 'Cool'
                            })
                          }else{
                            eng.graphArray.push(eng.graphArray.get(targetId.value).clone(cloneId.value));
                          }
                        }
                      });
                    }
                    
                  }
                });
              }}
              />
  }
  cloneSelectedButton(){
    const eng = this.props.engine;
    return <Button1 
          text="clone"
          action={()=>{
            Swal.fire({
              text: "GraphObject id for the clone: ",
              showDenyButton: false,
              showConfirmButton: true,
              confirmButtonColor:"green",
              showCancelButton: true,
              confirmButtonText: "Clonar",
              cancelButtonText: "Cancelar",
              input:"text"
            }).then((cloneId) => {
              if (cloneId.isConfirmed && cloneId.value != "") {
                if(eng.graphArray.exist(cloneId.value)){
                  Swal.fire({
                    title: 'Error!',
                    text: 'Ya existe un GraphObject con tal id',
                    icon: 'error',
                    confirmButtonText: 'Cool'
                  })
                }else{
                  eng.graphArray.push(eng.graphArray.get(this.selectedObject).clone(cloneId.value));
                }
              }
            }
          );
        }
      }
    />
  }
  deleteSelectedButton(){
    const eng = this.props.engine;
    return <Button1 
      text="delete"
      action={()=>{
        Swal.fire({
          text: "DELETE?: ",
          showDenyButton: false,
          showConfirmButton: true,
          confirmButtonColor:"red",
          showCancelButton: true,
          confirmButtonText: "Yes",
          cancelButtonText: "No"
        }).then((confir) => {
          if (confir.isConfirmed) {
            eng.graphArray.remove(this.selectedObject);
          }
        });
      }}
    />
  }
  render(){
    const eng = this.props.engine;
      return(
        <div className='text-white flex flex-row h-full'>
          <div className="flex flex-col max-h-full p-2">
            <div>
              Objects List
            </div>
            {this.creationButton()}
            {this.cloneButton()}
            <MenuButton text="Unselect" action={()=>{eng.objectsToDebug = [];this.selectedObject=""; this.forceUpdate();}}/>
            <div className="relative w-full overflow-auto">
              {this.objectsList()}
            </div>
          </div>
          <div className="flex flex-col h-full w-full p-2">
            <div>
              Edit
            </div>

            <div className="relative h-full w-full overflow-hidden text-sm px-2 flex flex-col">
              <div className='grow overflow-auto'>
                {this.selectedObject == "" ? null : this.cloneSelectedButton()}
                {this.selectedObject == "" ? null : this.deleteSelectedButton()}
                {this.listProperties()}
              </div>
            </div>
          </div>
        </div>
      )
  }
}

export { ObjectsE }
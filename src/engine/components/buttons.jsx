import React from "react";

import arrow from "../res/engineRes/arrow.svg";
import trash from "../res/engineRes/trash.svg";
import show from "../res/engineRes/eye.svg";
import file from "../res/engineRes/file.svg";
import folder from "../res/engineRes/folder.svg";
import hide from "../res/engineRes/eye-closed.svg";
import cross from "../res/engineRes/cross.svg";
import save from "../res/engineRes/save.svg";
import squares from "../res/engineRes/squares.svg";
import square from "../res/engineRes/square.svg";
import squareFull from "../res/engineRes/squareFull.svg";
import minus from "../res/engineRes/minus.svg";
import plus from "../res/engineRes/plus.svg";
import play from "../res/engineRes/play.svg";
import pause from "../res/engineRes/pause.svg";
import repeat from "../res/engineRes/repeat.svg";

import gsap from "gsap";
import $ from "jquery";
import './highlight-within-textarea/jquery.highlight-within-textarea.js';
import './highlight-within-textarea/jquery.highlight-within-textarea.css';
import Swal from "sweetalert2";

const icons ={
  arrow:arrow,
  trash:trash,
  show:show,
  file:file,
  folder:folder,
  hide:hide,
  cross:cross,
  save:save,
  squares:squares,
  square:square,
  squareFull:squareFull,
  minus:minus,
  plus:plus,
  play:play,
  pause:pause,
  repeat:repeat
}

class ListCheckedBox extends React.Component{
  actionButton(element){
    if(element.actionName != undefined){
      return(
        <div 
        className={" cursor-pointer mx-1 p-[1px] my-auto rounded-md bg-teal-500 text-white w-fit h-fit text-[12px]" + ((!element.check) ? " hidden":"")} 
        onClick={()=>{element.action()}}>
          {element.actionName}
        </div>
      );
    }
  }
  list(){
    return(
      this.props.list.map(element => (
        <div className="flex flex-row w-auto">
          <div className={"border-[1px] mr-1 h-4 w-4 my-auto border-white "+(element.check ? "bg-green-700": "")}/>
          {element.text}
          {this.actionButton(element)}
        </div>      
      ))
    );
  }
  render(){
    return(
      <div className="flex flex-col w-auto mx-1">
        {this.list()}
      </div>
    );
  }
}
class BaseButton extends React.Component{
  render(){
    return(
      <div 
        className={("style" in this.props ? this.props.style : "") + ((this.props.hide) ? " hidden":"")} 
        onClick={()=>{this.props.action()}}
        onMouseEnter={()=>{if("enter" in this.props){this.props.enter();}}}
        onMouseLeave={()=>{if("leave" in this.props){this.props.leave();}}}>
        {this.props.text}
      </div>
    );
  }
}
class Button1 extends React.Component{
  render(){
    return(
      <div 
        className={" cursor-pointer p-1 rounded-md bg-teal-500 text-white w-fit h-fit text-[12px] " + ("style" in this.props ? this.props.style : "m-1") + ((this.props.hide) ? " hidden":"")} 
        onClick={()=>{this.props.action()}}
        onMouseEnter={()=>{if("enter" in this.props){this.props.enter();}}}
        onMouseLeave={()=>{if("leave" in this.props){this.props.leave();}}}>
        {this.props.text}
      </div>
    );
  }
}
class IconButton extends React.Component{
  constructor(props){
    super(props);
  }
  render(){
    return(
      <div className={"cursor-pointer flex "+ ("style" in this.props ? this.props.style : "h-6 w-6 m-1")+ ((this.props.hide) ? " hidden":"")} onClick={()=>{this.props.action()}}>
        <div className={"bg-cover bg-no-repeat " + ("iconStyle" in this.props ? this.props.iconStyle : "w-full h-full")}
             style={{backgroundImage:"url('"+icons[this.props.icon]+"')"}} />
      </div>
    );
  }
}
class PauseButton extends React.Component{
  constructor(props){
    super(props);
  }
  render(){
    return(
      <div className="relative m-1 cursor-pointer text-white w-10 h-10" onClick={()=>{this.props.action()}}>
        <div className="left-1 absolute w-3 h-10 bg-white rounded-sm"/>
        <div className="right-1 absolute w-3 h-10 bg-white rounded-sm"/>
        {this.props.text}
      </div>
    );
  }
}
class MenuButton extends React.Component{
  constructor(props){
    super(props);
  }
  render(){
    this.textSize = ("textSize" in this.props ? this.props.textSize : 18)+"px";
    return(
      <div className={" cursor-pointer m-1 text-white w-fit h-fit hover:text-slate-400 "  + ("style" in this.props ? this.props.style : "") + (this.props.hide ? " hidden":"")} onClick={"action" in this.props ? ()=>{this.props.action()} : ()=>{throw new Error("Accion para el botón con texto '"+this.props.text+"' no definida")}} style={{fontSize:this.textSize, fontFamily:"Harry Thin", letterSpacing:"0.15em", transform:"scaleY(0.9)",  filter: "invert(0%)"}}>
        {this.props.text}
      </div>
    );
  }
}
class InputTextArea extends React.Component {
  constructor(props) {
    super(props);
    window.lastInputIdAssigned = window.lastInputIdAssigned == undefined ? 0 : window.lastInputIdAssigned;
    this.state = {
      focus: false,
      inputMinHeight: 0,
      error: ((typeof this.props.action) == "undefined") || (typeof this.props.value == "undefined") || !(typeof this.props.action == "function"),
    }
    this.value=0;
    this.inputBoxRef = React.createRef();
    this.inputRef = React.createRef();
    this.id = "id" in this.props ? this.props.id : ("inputTextArea" + String(window.performance.now()).replaceAll(".",""));
    this.handleClickOutside = this.handleClickOutside.bind(this);
    this.mounted = false;
    this.caretPosWhenBlur = {start:0,end:0};
  }
  componentDidMount() {
    if(!this.mounted){
      this.mounted = true;
      document.addEventListener("mousedown", this.handleClickOutside);
      $('#'+this.id).highlightWithinTextarea({
        highlight: [
            {
              highlight: 'new',
              className: 'text-red-700'
            },
            {//comentario
              highlight: /\/\/[^\*]\s*.*/g,
              className: 'text-[#6272A4]'
              
            },
            {//*comentario
              highlight: /\/\/\*\s*.*/g,
              className: 'text-[#98C379]'
            },
            {
              highlight: ['GraphObject','TextureAnim','Trigger','KeyboardTrigger','Animation','CodedRoutine','(',')','{','}'],
              className: 'text-[#357FBF]'
            },
            {
              highlight: [/if( {0,})\(/g,/([^A-Za-z\d\w]{0,1})let( {1,})/g,/([^A-Za-z\d\w]{0,1})const( {1,})/g],
              className: 'text-[#DB974D]'
            },
            {
              highlight: '=>',
              className: 'text-[#DB974D]'
            },
            {
              highlight: [/\d/g,'[',']'],
              className: 'text-[#86DBFD]'
            },
            {
              highlight:[ /={1}/g , /\+{1}/g , /-{1}/g , /\*{1}/g , /\/{1}/g , /\<{1}/g , /\>{1}/g , /\+={1}/g , /=={1}/g],
              className: 'text-[#E53935]'
            },
            {
              highlight: [/"(.*?)"/g],
              className: 'text-[#A18649]'
            },
            {
              highlight: [/^\s*(set){1}(\W)/gm,/^\s*(run){1}(\W)/gm,/^\s*(wait){1}(\W)/gm,/^\s*(show){1}(\W)/gm,/^\s*(load){1}(\W)/gm,/^\s*(\$){1}(\W)/gm,/^\s*(narration){1}(\W)/gm],
              className: 'text-green-600'
            }
        ]
      });
      this.inputRef.current.value = "defaultValue" in this.props ? this.props.defaultValue : "";
      $('#'+this.id).trigger("load");
      this.setState({
        inputMinHeight: this.inputBoxRef.current.offsetHeight,
      });
    }
  }
  componentDidUpdate(){
    this.inputRef.current.value = "defaultValue" in this.props ? this.props.defaultValue : "";
    $('#'+this.id).trigger("load");
  }
  
  componentWillUnmount() {
    document.removeEventListener("mousedown", this.handleClickOutside);
  }
  handleClickOutside(e) {
    if (this.inputBoxRef && !this.inputBoxRef.current.contains(e.target) && this.state.focus) {
      this.unhover();
    }
  }
  hover() {
    if (!this.state.error && (typeof this.props.action == "function")) {
      this.setState({
        focus: true
      });
      let inputBoxRef = this.inputBoxRef.current;
      gsap.to(inputBoxRef, { borderColor: 'rgb(0, 115, 170)' });
    }
  }
  action(){
    if(typeof this.props.action == "function"){
      this.props.action(this.inputRef.current.value);
    }
  }
  unhover() {
    if (this.state.focus) {
      this.setState({
        focus: false,
      }, () => {
        let inputBoxRef = this.inputBoxRef.current;
        gsap.to(inputBoxRef, { borderColor: '#000' });

        //*DevelopMode
        if (typeof this.props.action == "undefined") {
          this.inputRef.current.value = "NoFunctionToCallback";
        }
        //*EndDevelopMode
      });
    }
  }

  render() {
    let height = typeof this.props.height == 'string' ? ' ' + this.props.height + ' ' : ' h-36 ';

    let fatherStyle = typeof this.props.fatherStyle == 'string' ? ' ' + this.props.fatherStyle + ' ' : 'bg-transparent';
    return (
      <>
        <label htmlFor={this.id} onClick={() => { this.hover() }} className="p-0 m-0 relative h-full w-full">
          <div
            ref={this.inputBoxRef}
            className={"p-0 h-full select-none w-full overflow-x-hidden  " + fatherStyle}
          >
            <textarea
              className={height + "w-full resize-none outline-none align-top border-none bg-transparent text-transparent caret-white p-2"}
              type="text"
              onBlur={(e)=>{
                const element = $("#"+this.id).get(0);
                var start = element.selectionStart;
                var end = element.selectionEnd;
                this.caretPosWhenBlur = {start:start,end:end};
              }}
              defaultValue={"value" in this.props? this.props.value : ""}
              ref={this.inputRef}
              name={this.id}
              id={this.id}
              spellCheck={false}
              onChange={()=>this.action()}
              onKeyUp={e => {
                if(e.key == "Tab"){e.preventDefault();}
              }}
              onKeyDown={e => {
                if(e.ctrlKey){
                  if("onControl" in this.props){
                    if(e.key in this.props.onControl){this.props.onControl[e.key](e);}
                  }
                }else{
                  if (e.key == 'Tab') {
                    e.preventDefault();
                    const element = $("#"+this.id).get(0);
                    var start = element.selectionStart;
                    var end = element.selectionEnd;
                
                    if(e.shiftKey){
                      // set textarea value to: text before caret + tab + text after caret
                      element.value = element.value.substring(0, start-2) + element.value.substring(end);
                      console.log(element.value.substring(start-2,end));
                      // put caret at right position again
                      element.selectionStart =
                      element.selectionEnd = start - 2;
                    }else{
                      // set textarea value to: text before caret + tab + text after caret
                      element.value = element.value.substring(0, start) +
                      "  " + element.value.substring(end);
                      
                      // put caret at right position again
                      element.selectionStart =
                      element.selectionEnd = start + 2;
                    }
                
                    this.action();
                    $('#'+this.id).trigger("load");
                  }
                  if (e.key == 'Enter') { //Avoid autoscroll on enter
                    e.preventDefault();
                    const element = $("#"+this.id).get(0);
                    var start = element.selectionStart;
                    var end = element.selectionEnd;
                
                    // set textarea value to: text before caret + tab + text after caret
                    element.value = element.value.substring(0, start) +
                      '\r\n' + element.value.substring(end);
                
                    this.action();
                    $('#'+this.id).trigger("load");
                    // this.forceUpdate();
                    // put caret at right position again
                    element.selectionStart =
                    element.selectionEnd = start+1;
  
  
                  }
                }
              }} />
          </div>
        </label>
      </>
    );
  }
}
class InputText extends React.Component{
  render(){
    return(
      <input 
        className={" bg-black my-0.5 px-1 rounded-md text-white text-[12px] " + ("style" in this.props ? this.props.style : "") + ((this.props.hide) ? " hidden":"")} 
        defaultValue={"defaultValue" in this.props ? this.props.defaultValue : ""}
        onClick={()=>{if("action" in this.props){this.props.action()}}}
        onChange={(e)=>{if("change" in this.props){this.props.change(e.target.value)}}}
        onMouseEnter={()=>{if("enter" in this.props){this.props.enter();}}}
        onMouseLeave={()=>{if("leave" in this.props){this.props.leave();}}}
      />
    );
  }
}
class InputList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      animate: false,
      showAnimationDone: false,
      activateHideAnimation: false,
      zIndex: (10),
      error: ((typeof this.props.action) == "undefined") || (typeof this.props.value == "undefined") || (typeof this.props.options == "undefined"),
      heightPerOption: (typeof this.props.height == 'string' ? this.props.height : 16),
    }
    this.value = 0;
    this.inputRef = React.createRef();
    this.optionsBoxRef = React.createRef();
    this.handleClickOutside = this.handleClickOutside.bind(this);
    this.preventDefault = this.preventDefault.bind(this);
  }
  calculateHeight() {
    let boxHeight;

    const optionsBox = this.optionsBoxRef.current.childNodes[1];
    const customMaxHeight = (this.props.optionsBoxHeight ? this.props.optionsBoxHeight : 0);

    if (customMaxHeight > 0 && customMaxHeight < optionsBox.scrollHeight) {
      boxHeight = customMaxHeight;

    } else {
      boxHeight = optionsBox.scrollHeight;

    }
    return boxHeight
  }
  componentWillUnmount() {
    document.removeEventListener("mousedown", this.handleClickOutside);
  }
  componentDidUpdate() {
    if (this.state.animate && !this.state.showAnimationDone && !this.state.activateHideAnimation) {
      this.animateHover();
      this.setState({ showAnimationDone: true });
    }
    if (this.state.showAnimationDone && this.state.activateHideAnimation) {
      this.setState(
        {
          animate: false,
          showAnimationDone: false,
          activateHideAnimation: false,
          optionsBoxHeight: 0
        },
        () => {
          this.animateUnHover();
        }
      );
    }
  }
  handleClickOutside(e) {
    if (this.inputRef && !this.inputRef.current.contains(e.target)) {
      this.unhover();
    }
  }
  animateHover() {
    const optionsBox = this.optionsBoxRef.current.childNodes[1];
    gsap.to(optionsBox, 0.4, { height: this.calculateHeight() });

    const inputRef = this.inputRef.current;
    gsap.to(inputRef, { borderColor: 'rgb(0, 115, 170)' });
  }
  animateUnHover() {
    const optionsBox = this.optionsBoxRef.current.childNodes[1];
    gsap.to(optionsBox, 0.4, { height: '0' });
    let inputRef = this.inputRef.current;
    gsap.to(inputRef, { borderColor: '#000' });
  }
  hover() {
    this.animateHover();
    document.addEventListener("mousedown", this.handleClickOutside);
  }
  unhover() {
    this.animateUnHover();
    document.removeEventListener("mousedown", this.handleClickOutside);
  }
  preventDefault(e) {
    e.preventDefault();
  }
  action(value,option) {
    if (!this.state.error && (typeof this.props.action == "function")) {
      this.props.action(value);
      this.value = value;
      this.forceUpdate();
    }
  }
  calcScrollAutoDisplace(){
    let heightPerOption = this.state.heightPerOption;
    let optionsBoxHeight = this.calculateHeight();
    let optionsBox = this.optionsBoxRef.current.childNodes[1];
    let actualOptionInYAxis = (this.value+1)*heightPerOption;

    if(actualOptionInYAxis > (optionsBox.scrollTop+optionsBoxHeight)){
      optionsBox.scrollTop = actualOptionInYAxis-optionsBoxHeight;
    }else if((actualOptionInYAxis-heightPerOption) < optionsBox.scrollTop){
      optionsBox.scrollTop = (actualOptionInYAxis-heightPerOption);
    }
  }
  renderOptions(/*customHeight*/) {
    let options = this.props.options;
    let startFrom = this.props.start;
    let selected = this.value;
    let customHeight = "h-[28px] ";
    // console.log(customHeight);
    if (options) {
      if (options.length > 0) {
        if (startFrom) {
          return (
            options.map(
              (option, index) => (
                <div
                  className={(selected == index + startFrom ? "text-white " : "") + (index == 0 ? "" : "") + " py-[2px] text-[13px] px-2 cursor-pointer flex min-" + (customHeight.replace(/ /g, ""))}
                  style={{ backgroundColor: (selected == index + startFrom ? "rgb(10, 67, 145)" : "") }}
                  key={index}
                  value={index}
                  onClick={() => { this.action(index + startFrom, option) }}>
                  <div className="my-auto w-fit h-fit text-[13px]">
                    {option}
                  </div>
                </div>
              )
            )
          );
        } else { 
          return (
            options.map(
              (option, index) => (
                <div
                  className={(selected == index ? "text-white " : "") + (index == 0 ? "" : "") + " py-[2px] text-[13px] px-2 cursor-pointer flex min-" + (customHeight.replace(/ /g, ""))}
                  style={{ backgroundColor: (selected == index ? "rgb(10, 67, 145)" : "") }}
                  key={index}
                  value={index}
                  onClick={() => { this.action(index, option) }}>
                  <div className="my-auto w-fit h-fit">
                    {option}
                  </div>
                </div>
              )
            )
          );
        }
      }
      else {
        return ("NOOPTIONS");
      }
    }
    else {
      return ("NOOPTIONS");
    }
  }
  render() {
    let placeholder = (typeof this.props.placeholder == 'string' ? this.props.placeholder : 'Seleccionar');
    let textValue = this.value != null ? this.props.options[this.value] : placeholder;
    let height = "h-[28px] ";

    let fatherStyle = typeof this.props.fatherStyle == 'string' ? ' ' + this.props.fatherStyle + ' ' : '';

    let errorStyle = (this.state.error ? "border-red-600 border-4" : "border-[#0b2140] border-[1px]");
    return (
      <div className={height + " flex max-w-[200px] m-1"}>
        <div
          style={{ zIndex: this.state.zIndex }}
          className={"select-none relative z-[" + this.state.zIndex + "] focus:outline-none text-black h-fit w-full " + errorStyle + " rounded-md bg-white overflow-x-hidden " + fatherStyle}
          ref={this.inputRef}
          tabIndex={0}
          onFocus={() => { this.hover() }}
          onBlur={() => { this.unhover() }}
          onMouseEnter={() => { this.hover() }}
          onMouseLeave={() => { this.unhover() }}>
          <div
            className={(height) + "flex w-full px-2 " + (this.value == null ? 'text-gray-500' : '')}
            onClick={() => { this.hover() }}>
            <div className="my-auto w-full text-[13px]">
              <div className="w-full whitespace-nowrap text-ellipsis overflow-hidden">{textValue}</div>
              
            </div>
          </div>
          <div
            className=" w-full h-fit relative"
            ref={this.optionsBoxRef}>
            <div className="absolute top-0 w-full h-0"/>
            <div
              className={"w-full h-0 flex flex-col "+("overflow-auto")}>
              {this.renderOptions(/*height*/)}
            </div>
            <div className="absolute bottom-0 w-full h-0"/>
          </div>
        </div>
      </div>
    );
  }
}
export {Button1, BaseButton, MenuButton, PauseButton, IconButton, ListCheckedBox, InputTextArea, InputText, InputList}
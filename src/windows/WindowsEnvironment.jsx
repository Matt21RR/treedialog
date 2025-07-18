import React from "react";
import { BaseButton } from "../tools/components/Buttons";
import { Window } from "./Window.tsx";

class WindowsEnvironment extends React.Component{
  constructor(props){
    super(props);
    if(props.refAssigner){
      props.refAssigner(this);
    }
    if(!(this.props)){return;}
    this.renderSecondaryContent = false;
    this.windowsContent = "content" in this.props ? this.props.content : {};
    this.executionTable = {};
    this.minimizedTable = [];
    this.previewTable = [];
    Object.keys(this.windowsContent).map(windowId=>{
      Object.assign(this.executionTable, 
        {[windowId]:!(this.windowsContent[windowId].disabled ?? true)}
      );
    });
    Object.keys(this.windowsContent).map(windowId=>{
      if("minimized" in this.windowsContent[windowId]){
        this.minimizedTable.push(windowId);
      }
    });
    this.renderingOrder = Object.keys(this.windowsContent);
  }
  clickWindow(windowId){
    if(this.renderingOrder.indexOf(windowId) == (this.renderingOrder.length-1)){
      return;
    }
    var a = structuredClone(this.renderingOrder);
    a.splice(a.indexOf(windowId),1);
    a.push(windowId);
    this.renderingOrder = a;
    this.forceUpdate();
  }
  renderWindows(){
    if(!this.renderSecondaryContent){return;}
    const windowsContent = this.props.content;
    return(
      Object.keys(windowsContent).filter(
        windowId=>{return !(windowsContent[windowId].disabled ?? true)}
      ).map((contentId)=>(
        <div 
          className="relative" 
          style={{
            zIndex:this.renderingOrder.indexOf(contentId)+1, 
            filter:"opacity("+(this.renderingOrder.indexOf(contentId)+1 == this.renderingOrder.length ? 1 : .9)+") "+(this.renderingOrder.indexOf(contentId)+1 != this.renderingOrder.length ? "grayscale(.3)" : "")}}
        >
          <Window 
            content={windowsContent[contentId].content} 
            minimize={()=>{this.minimizedTable.push(contentId);this.previewTable.splice(this.previewTable.indexOf(contentId),1);this.forceUpdate();}}
            minimized={this.minimizedTable.indexOf(contentId) != -1}
            preview={this.previewTable.indexOf(contentId) != -1}
            title={windowsContent[contentId].title} 
            onResize={"onResize" in windowsContent[contentId] ? windowsContent[contentId].onResize : ()=>{}}
            minRes={"minRes" in windowsContent[contentId] ? windowsContent[contentId].minRes : {width:600,height:450} }
            resizeBlocked={"resizeBlocked" in windowsContent[contentId] ? windowsContent[contentId].resizeBlocked : false }
            clicked={()=>this.clickWindow(contentId)}
            reRender={()=>this.forceUpdate()}
          />
        </div>
        
      ))
    );  
  }
  renderTaskBar(){
    return(
      <div className="relative h-full min-w-[3rem] bg-[#2f2f2fba] flex flex-col">
        {this.minimizedTable.map(contentId=>{return (
          <BaseButton
            action={()=>{this.minimizedTable.splice(this.minimizedTable.indexOf(contentId),1);this.forceUpdate();}}
            enter={()=>{this.previewTable.push(contentId); this.forceUpdate();}}
            leave={()=>{this.previewTable.splice(this.previewTable.indexOf(contentId),1);this.forceUpdate();}}
            style="text-white mx-auto p-2 hover:bg-white hover:bg-opacity-30 cursor-pointer"
            text = {contentId}
          />
        )})}
      </div>
    );
  }
  render(){
    return(
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
        <div className="absolute top-0 left-0 h-full w-full bg-[#2f2f2fba] flex">
          {this.renderTaskBar()}
          <div className="grow h-full">
            {this.props.mainContent}
          </div>
        </div>
        {this.renderWindows()}
      </div>
    );
  }
}

export {WindowsEnvironment}
function loadjscssfile(filename){
  var fileref=document.createElement('script')
  fileref.setAttribute("type","text/javascript")
  fileref.setAttribute("src", filename)
 //appendChild(fileref)
  document.getElementsByTagName("head")[0].appendChild(fileref)
}

Array.prototype.find = function(searchStr) {
  for (i=0; i<this.length; i++) {
      if (this[i]===searchStr) {
		return true;
    }
  }
  return false;
}
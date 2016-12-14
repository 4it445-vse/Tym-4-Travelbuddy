import React, { Component } from 'react'
import api from '../api'


export default class UploadExample extends Component {
  constructor(props){
    super(props)

    this.onClick = this.onClick.bind(this);
  }

  onChange(e) {
    var filesize = (e.target.files[0].size/1024/1024).toFixed(2);
    console.log(filesize < 1)
    console.log(e.target.files[0].name)
  }

  onClick() {
var data = new FormData()

    data.append("file", this.refs.File.files[0])
    console.log("Here");
    api.post('containers/folder/upload', data)
  }

  render() {

    return (
      <div className="row">
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
        <input
          type="file"
          placeholder="Vybrat soubor"
          accept="image/*"
          ref="File"
          onChange={this.onChange}
        />
        <input
          type="button"
          value="Nahrát"
          onClick={this.onClick}
        />
      </div>
    )
  }
}

import React, { Component } from "react";
import RecordDataService from "./api/RecordDataService";

import CsvParse from "@vtex/react-csv-parse";

class Upload extends Component {
  constructor(props) {
    super(props);
    this.state = {
      records: [],
      uploadSuccess: false
    };
  }
  handleData(files) {
    for (let i = 0; i < files.length; i++) {
      delete files[i]["passengerid"];

      RecordDataService.uploadRecord(files[i]);
    }
    this.setState({
      records: files,
      uploadSuccess: true
    });
  }

  render() {
    const { uploadSuccess } = this.state;
    const keys = [
      "passengerid",
      "survived",
      "pclass",
      "name",
      "sex",
      "age",
      "sibsp",
      "parch",
      "ticket",
      "fare",
      "cabin",
      "embarked"
    ];
    return (
      <div>
        <CsvParse
          keys={keys}
          onDataUploaded={this.handleData.bind(this)}
          onError={this.handleError}
          render={onChange => <input type="file" onChange={onChange} />}
        />
        {uploadSuccess ? (
          <div className="jumbotron text-center">
            <h2>Upload Success!</h2>
          </div>
        ) : (
          ""
        )}
      </div>
    );
  }
}
export default Upload;

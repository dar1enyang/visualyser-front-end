import React, { Component } from "react";
import RecordDataService from "./api/RecordDataService";
import JqxGrid, { jqx } from "./assets/jqwidgets-react/react_jqxgrid";

class Test extends Component {
  constructor(props) {
    super(props);
    this.state = {
      columns: [
        { text: "Passenger", datafield: "Passenger", width: "6%" },
        { text: "Survived", datafield: "Survived", width: "6%" },
        { text: "Pclass", datafield: "Pclass", width: "6%" },
        { text: "Name", datafield: "Name", width: "24%" },
        { text: "Sex", datafield: "Sex", width: "5%%" },
        { text: "Age", datafield: "Age", width: "3%" },
        { text: "Sibsp", datafield: "Sibsp", width: "3%" },
        { text: "Parch", datafield: "Parch", width: "3%" },
        { text: "Ticket", datafield: "Ticket", width: "12%" },
        { text: "Fare", datafield: "Fare", width: "15%" },
        { text: "Cabin", datafield: "Cabin", width: "10%" },
        { text: "Embarked", datafield: "Embarked", width: "6%" }
      ],
      records: [],
      source: new jqx.dataAdapter({
        localdata: [
          [
            "1",
            "0",
            "3",
            "Braund, Mr. Owen Harris",
            "male",
            "22",
            "1",
            "0",
            "A/5 21171",
            "7.25",
            "",
            "S"
          ],
          [
            "1",
            "0",
            "3",
            "Braund, Mr. Owen Harris",
            "male",
            "22",
            "1",
            "0",
            "A/5 21171",
            "7.25",
            "",
            "S"
          ]
        ],
        datafields: [
          { name: "Passenger", type: "string", map: "0" },
          { name: "Survived", type: "string", map: "1" },
          { name: "Pclass", type: "string", map: "2" },
          { name: "Name", type: "string", map: "3" },
          { name: "Sex", type: "string", map: "4" },
          { name: "Age", type: "string", map: "5" },
          { name: "Sibsp", type: "string", map: "6" },
          { name: "Parch", type: "string", map: "7" },
          { name: "Ticket", type: "string", map: "8" },
          { name: "Fare", type: "string", map: "9" },
          { name: "Cabin", type: "string", map: "10" },
          { name: "Embarked", type: "string", map: "11" }
        ],
        datatype: "array"
      })
    };

    this.loadRecords = this.loadRecords.bind(this);
    this.state.source.dataBind();
  }

  loadRecords() {
    RecordDataService.retrieveAllRecords().then(response => {
      let array = [];
      for (let i = 0; i < response.data.length; i++) {
        array.push(Object.values(response.data[i]));
      }

      this.state.source._source.localdata = array;
      this.state.source.dataBind();

      this.setState({
        records: array
      });
    });
    RecordDataService.retrieveRecordsSurvived(1).then(response => {
      let array = [];
      for (let i = 0; i < response.data.length; i++) {
        array.push(Object.values(response.data[i]));
      }
      this.setState({
        survivedRecords: array
      });
      console.log(this.state);
    });
    /* return RecordDataService.retrieveAllRecords().then(response => {
      let array = [];
      for (let i = 0; i < response.data.length; i++) {
        array.push(Object.values(response.data[i]));
      }

      this.state.source._source.localdata = array;
      this.state.source.dataBind();

      this.setState({
        records: array
      });
    }); */
  }
  componentDidMount() {
    this.loadRecords();
    /* this.loadRecords().then(res => {}); */
  }
  loadToGrid() {}
  render() {
    return (
      <div className={"jqxgrid"} style={{ width: "100%" }}>
        <div>Hello</div>
        <JqxGrid
          width={"100%"}
          source={this.state.source}
          columns={this.state.columns}
          pageable={true}
          autoheight={true}
          sortable={true}
          altrows={true}
          enabletooltips={true}
          editable={true}
          selectionmode={"multiplecellsadvanced"}
        />
      </div>
    );
  }
}

export default Test;

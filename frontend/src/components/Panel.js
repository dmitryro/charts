import '@fortawesome/fontawesome-free/css/all.min.css';
import 'bootstrap-css-only/css/bootstrap.min.css';
import 'mdbreact/dist/css/mdb.css';
import { BarChart, d3 } from 'react-d3-components';
import React, { Component }from 'react';
import ReactDOM from 'react-dom';
import { Container, Row, Col } from 'reactstrap';
import { MDBContainer, MDBRow, MDBCol, MDBInput, MDBBtn } from 'mdbreact';


class Panel extends Component {


    constructor(props) {
      super(props);
      this.state = {
           end_time:'', 
           deviceuuid: '',
           numwindows: '',
           windowtime: '',
      };
      this.handleSubmit = this.handleSubmit.bind(this);
      this.handleInputChange = this.handleInputChange.bind(this);
    }


 
    handleInputChange(event) {
        const target = event.target;
        const value = target.value;
        const name = target.name;

        console.log(`Input name ${name}. Input value ${value}.`);

        this.setState({
          [name]: value
        });
    };


    handleChanges = (e) => {
       const input = e.target;
       const name = input.name;
       const value = input.value;
      this.setState({ [name]: value });
    };


    handleSubmit(event) {
        event.preventDefault();
        const form = event.target;
        const data = new FormData(form);
        let s = this.state;
        // Use environment variables to get the API host and port
        let url = `http://${process.env.API_HOST}:${process.env.API_PORT}/bandwidths/${s.deviceuuid}/${s.end_time}/${s.windowtime}/${s.numwindows}`;
        // Fetch the values from API
        fetch(url).then(function(data) {
           var response = data.json();
           response.then(function(result) {
              // Cook the data
              var data = [];

              for (var i = 0; i < result.length; i++) {
                      var timestamp = result[i].timestamp;
                      var val = [{x: "To Server", y:result[i].bytes_ts}, {x: "From Server", y: result[i].bytes_fs}];
                      var step = {label: `value_${i}`, values: val};
                      data.push(step);                
              }

              const element = (
                          <BarChart
                           groupedBars
                           data={data}
                           width={400}
                           height={400}
                           margin={{top: 10, bottom: 50, left: 50, right: 10}}/>
              );

              ReactDOM.render(element, document.getElementById('chart'));
              this.forceUpdate();
           });

        }).catch(function(error) {
           console.log("ERROR:"+error);
        });   

    };

    render() {
           return (
      <div>
          <Container>
              <Row>
                  <Col xs="6">
                      <MDBContainer>
                          <MDBRow>
                              <MDBCol md="12">
                                  <form onSubmit={this.handleSubmit}>
                                      <label htmlFor="defaultFormRegisterNameEx" className="grey-text">
                                      Device UUID
                                      </label>
                                      <input
                                       name="deviceuuid" 
                                       ref="deviceuuid" 
                                       value={this.state.deviceuuid} 
                                       onChange={this.handleInputChange}
                                       type="text"
                                       className="form-control"
                                      />
                                      <br />

                                      <label htmlFor="defaultFormEndTimeEx" className="grey-text">
                                      End Time
                                      </label>

                                      <input
                                       type="text"
                                       name="end_time"
                                       ref="end_time"
                                       value={this.end_time}
                                       onChange={this.handleInputChange}
                                       className="form-control"
                                       />

                                      <br/>
                                      <label htmlFor="defaultFormRegisterNameEx" className="grey-text">
                                      Window Time
                                      </label>
                                      <input
                                       type="text"
                                       name="windowtime" 
                                       ref="windowtime"
                                       value={this.state.windowtime} 
                                       onChange={this.handleInputChange}
                                       className="form-control"
                                       />
                                      <br />

                                      <label htmlFor="defaultFormRegisterNameEx" className="grey-text">
                                        Number of windows
                                      </label>
                                      <input
                                       name="numwindows" 
                                       ref="numwindows"
                                       value={this.state.numwindows} 
                                       onChange={this.handleInputChange}
                                       type="text"
                                       className="form-control"
                                       />
                                      <br />

                                      <div className="text-center mt-4">
                                      <MDBBtn color="indigo" type="submit">Send</MDBBtn>
                                      </div>
                                  </form>
                              </MDBCol>
                          </MDBRow>
                      </MDBContainer>
                  </Col>
                  <Col xs="6">
                      <div id="chart">
                      </div>
                  </Col>
              </Row>
          </Container>
       </div>
           );
    }
}

export default Panel;

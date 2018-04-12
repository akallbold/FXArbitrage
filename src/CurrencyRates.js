import React, { Component } from 'react';


class CurrencyRates extends Component {


//   constructor(props){
//     super(props);
//     this.state = {size: 3}
//   }
//   render(){
//     let rows = [];
//     for (var i = 0; i < this.state.size; i++){
//       let rowID = `row${i}`
//       let cell = []
//       for (var idx = 0; idx < this.state.size; idx++){
//         let cellID = `cell${i}-${idx}`
//         cell.push(<td key={cellID} id={cellID}></td>)
//       }
//       rows.push(<tr key={i} id={rowID}>{cell}</tr>)
//     }
//     return(
//       <div className="container">
//         <div className="row">
//           <div className="col s12 board">
//             <table id="simple-board">
//                <tbody>
//                  {rows}
//                </tbody>
//              </table>
//           </div>
//         </div>
//       </div>
//     )
//   }
// }












  render() {
    return (
      <div className="currency-rates">
        <p>currency rates</p>
      </div>
    );
  }
}

export default CurrencyRates;

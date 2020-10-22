import React from 'react';
import Unit from './Unit';

export default class Row extends React.Component{

    render(){
        const { play, row } = this.props;
        let output = Object.keys(row).map(function(i) {
            return(<Unit key={i} val={row[i]} column={i} play={play}/>)
        })

        return (
            <tr>
                {output}
            </tr>
        )
    };
}

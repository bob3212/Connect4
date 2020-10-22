import React from 'react';

export default class Unit extends React.Component{

    render(){
        const { play, column, val } = this.props;
        let current="open";

        if(val === 1){
            current = "player1";
        }else if( val === 2){
            current = "player2";
        }
        return (
            <td>
                <div className="tile" onClick={() => {play(column)}}>
                    <div className={[current, "circle"].join(' ')}></div>
                </div>
            </td>
        )
    };
}

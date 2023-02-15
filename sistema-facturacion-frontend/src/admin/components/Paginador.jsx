import { useEffect, useState } from "react"
import { useSelector } from 'react-redux';


export const Paginador = () => {

    const [ newData, setNewData ] = useState([]);

    const { data } = useSelector( state => state.dashboard );

    useEffect( () => {
        setNewData( data );
    }, [data] );

    if( newData.length <= 10 ) {
        return;
    }


  return (
    <div className="flex justify-center lg:justify-end w-10/12 mx-auto mt-6">
        <div className="flex w-fit">

            <div 
                className="
                    border
                    rounded-tl-sm
                    rounded-bl-sm
                    border-blue-400
                    text-blue-900
                    cursor-pointer
                    font-medium
                    p-3"
            >
                    &lt;&lt;
            </div>

            <div
                className="
                    border-t
                    border-b
                    border-blue-400
                    text-blue-900
                    cursor-pointer
                    font-medium
                    p-3"
            >
                &lt;
            </div>

            <div
                className="
                    border
                    border-blue-400
                    text-blue-900
                    cursor-pointer
                    font-medium
                    p-3"
            >
                1
            </div>

            <div
                className="
                    border-t
                    border-b
                    border-blue-400
                    text-blue-900
                    cursor-pointer
                    font-medium
                    p-3"
            >
                &gt;
            </div>

            <div
                className="
                    border
                    rounded-tr-sm
                    rounded-br-sm
                    border-blue-400
                    text-blue-900
                    cursor-pointer
                    font-medium
                    p-3"
            >
                &gt;&gt;
            </div>

            
        </div>
        
    </div>
  )
}

import React from 'react';


const BaseContainer = ({children}: ReactNodeChildrenProp) => {
    return (
        <div className={"mx-auto w-full px-2 max-w-7xl"}>
            {children}
        </div>
    );
};

export default BaseContainer;
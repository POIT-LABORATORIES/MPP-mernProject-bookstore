import React from "react";

export const Loader = () => {
    return (
    <div style={{display: 'flex', justifyContent: 'center', paddingTop: '2rem'}}>
        <div class="progress">
            <div class="indeterminate"></div>
        </div>
        
    </div>
    );
}
import { propertiesContext } from "../context/propertiesConstext";
import { useContext, useState } from "react";

const Property = () => {
    const properties = useContext(propertiesContext);
    
    return (
        <>
            <div>
                {properties.map((property) => (
                    <div key={property.id}>
                        <img src={property.images} alt="imgs" />
                        <h3>{property.title}</h3>
                        <p>{property.description}</p>
                        <p>{property.rooms}</p>
                        <p>{property.location}</p>
                        <h4>${property.price}</h4>
                    </div>
                ))}
            </div>
        </>
    )
}

export default Property
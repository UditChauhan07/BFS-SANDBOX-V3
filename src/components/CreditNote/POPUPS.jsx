import React, { useEffect, useState } from 'react';
import { getCreditNote } from '../../api/creditNote';
import './style.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Loading from '../Loading';

function POPUPS({ onProductSelect, onClose, onManufacturersFetched }) {
    const [products, setProducts] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                const res = await getCreditNote();
                if (Array.isArray(res)) {
                    setProducts(res);

                    // Extract manufacturers and pass to parent
                    const uniqueManufacturers = [...new Set(res.flatMap(item => item.manufacturers))];
                    onManufacturersFetched(uniqueManufacturers);
                }
            } catch (error) {
                console.error('Error fetching products:', error);
            }
            setLoading(false);
        };
        fetchProducts();
    }, [onManufacturersFetched]);

    const handleProductSelection = (product) => {
        setSelectedProduct(product);
    };

    const handleSubmit = () => {
        if (selectedProduct) {
            onProductSelect(selectedProduct.manufacturers);
            onClose(); // Close modal after selection
        }
    };

    return (
        <>
            {loading ? (
                <Loading />
            ) : (
                <form>
                    <div className="heading">
                        <h3>Choose the Retailer</h3>
                    </div>
                    <div className='main-hero-sec'>
                        {products.map((item, index) => (
                            <div className="form-check" key={index}>
                                <input
                                    className="form-check-input"
                                    type="radio"
                                    name="productRadio"
                                    id={`product${index}`}
                                    value={item.accountName}
                                    onChange={() => handleProductSelection(item)}
                                />
                                <label className="form-check-label" htmlFor={`product${index}`}>
                                    {item.accountName} 
                                </label>
                                <span className='wallet'>
                                    ${item.totalWalletAmount}
                                    <div className='available'>Available Bal</div>
                                </span>
                                <br />
                            </div>
                        ))}

                        <div className="btn">
                            <button type="button" className='btn-cancel' onClick={onClose}>Cancel</button>
                            <button type="button" className='btn-submit' onClick={handleSubmit}>Submit</button>
                        </div>
                    </div>
                </form>
            )}
        </>
    );
}

export default POPUPS;

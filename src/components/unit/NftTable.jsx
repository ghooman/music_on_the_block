import songTypeIcon from '../../assets/images/icon/Songwriting-Icon.svg';
import mobIcon from '../../assets/images/icon/mob-icon.svg';

import './NftTable.scss';

const dummy = [
    {
        id: 1,
        nft_name: 'NFT NAME',
        collection: 'COLLECTION NAME',
        price: 12,
        adminssion_type: 'MOB',
        create_dt: '2005-05-05',
        status: 'sold',
    },
    {
        id: 2,
        nft_name: 'NFT NAME',
        collection: 'COLLECTION NAME',
        price: 17,
        adminssion_type: 'MOB',
        create_dt: '2005-05-05',
        status: 'sell',
    },
    {
        id: 3,
        nft_name: 'NFT NAME',
        collection: 'COLLECTION NAME',
        price: 210,
        adminssion_type: 'MOB',
        create_dt: '2005-05-05',
        status: 'cancel',
    },
];

const NftTable = ({ nftList, saleAction = true, handleSell, cancelOption, handleCancel }) => {
    return (
        <div className="unit-component-nft-table">
            <table>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Type</th>
                        <th>Item</th>
                        <th>Collection</th>
                        <th>Price</th>
                        <th>Date</th>
                        <th>Details</th>
                        {saleAction && <th>Sale Action</th>}
                    </tr>
                </thead>
                <tbody>
                    {dummy.map((nft, index) => (
                        <tr key={nft.id}>
                            <td>{index + 1}</td>
                            <td>
                                <div className="unit-component-nft-table__type-image">
                                    <img src={songTypeIcon} alt="music" />
                                </div>
                            </td>
                            <td>{nft?.nft_name}</td>
                            <td>{nft?.collection}</td>
                            <td>
                                <div className="unit-component-nft-table__price">
                                    {nft.price}
                                    <img src={mobIcon} alt="token" />
                                </div>
                            </td>
                            <td>{nft?.create_dt}</td>
                            <td>
                                <button className="unit-component-nft-table__button button-details">Details</button>
                            </td>
                            {saleAction && (
                                <td>
                                    {nft.status === 'sold' && (
                                        <button className={`unit-component-nft-table__button button-sold`}>Sold</button>
                                    )}
                                    {nft.status === 'sell' && (
                                        <button
                                            className={`unit-component-nft-table__button button-sell`}
                                            onClick={() => {
                                                if (handleSell) handleSell();
                                            }}
                                        >
                                            Sell
                                        </button>
                                    )}
                                    {nft.status === 'cancel' && (
                                        <button
                                            className={`unit-component-nft-table__button button-cancel`}
                                            onClick={() => {
                                                if (handleCancel) handleCancel();
                                            }}
                                        >
                                            Cancel
                                        </button>
                                    )}
                                </td>
                            )}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default NftTable;

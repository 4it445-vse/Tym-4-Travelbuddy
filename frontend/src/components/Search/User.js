import React, { Component } from 'react';

export class User extends Component {
    render() {
      const { data } = this.props;

      //{products.map(product =>
  //        <ProductListItem product={product} key={product.id}/>
//)}
        return (
                    <a href="" className="profil_vypis">
                        <div className="card-block">
                            <div className="col-lg-2 col-md-2 col-sm-3 col-xs-5 col" >
                                <img src="ss.jpeg" alt="..." className="profil_img rounded" />
                            </div>
                            <div className="col-lg-8 col-md-7 col-sm-5 col-xs-4 v-p-25">
                                <span className="v-o-25">Pavel Němec</span>
                            </div>
                            <div className="col-lg-2 col-md-3 col-sm-4 col-xs-3 v-p-25">
                                <span className="v-o-25">Zobrazit profil</span>
                            </div>
                        </div>
                    </a>
        );
    }
}

import './App.css';
import React from 'react';
import axios from 'axios';
const API = "https://gzxq65j3m2.execute-api.us-east-1.amazonaws.com/v1";
const ORG = "vsm";

const cache = {};

function search(list, setSuggestions) {
    if (list.length == 0)
        return;
    var promiseList = [];
    var idMap = {};

    list.forEach(s => {
        idMap[s] = [];
        var url = `${API}/donor/${ORG}/index/${s.toLowerCase()}`;
        if (cache[url]) {
            idMap[s] = cache[url];
        }
        else {
            console.log(url);
            var p = axios.get(url)
                .then(response => {
                    console.log("Caching: " + url);
                    cache[url] = response.data;
                    idMap[s] = response.data;
                });
            promiseList.push(p);
        }
    });
    Promise.all(promiseList)
        .then(x => {
            // Identify the id's present in each of the arrays
            var keys = Object.keys(idMap);
            var idList = [];
            if (keys) {
                idList = idMap[keys[0]].filter(id => {
                    var match = true;
                    keys.forEach(k => {
                        match &= idMap[k].includes(id);
                    });
                    return match;
                });
            }
            setSuggestions(idList);
        });

}

function DonorSuggestion({ donor }) {
    const [info, setInfo] = React.useState({});
    React.useEffect(() => {
        // Get details for the donor
        var url = `${API}/donor/${ORG}/basic/${donor}`;
        if (cache[url]) {
            setInfo(cache[url]);
        }
        else {
            console.log(url);
            axios.get(url).then(r => {
                cache[url] = r.data;
                setInfo(r.data);
            });
        }
    });

    return <div>{info.name} / {info.address}</div>;
}


function SearchField({ setSuggestions }) {
    const handleChange = (e) => {
        var s = e.target.value;
        var list = s.split(" ");
        list.pop();
        console.log("Invoking Search: " + list);
        setSuggestions([]);
        search(list, setSuggestions);
    };
    return (
        <input className="form-control" type="text" name="required" required="true"  onChange={handleChange}  />
    );

}

function DonorSearch() {
    const [suggestions, setSuggestions] = React.useState([
        "hello"
    ]);

    return (
        <div className="container clear-top">
            <div className="row">
                <div className="col-12">
                    <div className="App container p-4">
                        <div className="row">
                            <div className="col-12 p4-4 pb-4 mt-4 mb-4">
                                <h1>Donor Search</h1>
                            </div>
                        </div>
                        <div className="row">
                            <div className="card ">
                                <div className="card-header card-header-info card-header-text">
                                    <div className="card-text">
                                        <h4 className="card-title">Search</h4>
                                    </div>
                                </div>
                                <div className="card-body">
                                    <div className="row">
                                        <div className="col-12">
                                            Search for the donor using any of - name, phone number, email or pan. Or a combination of these, separated by space.
                                        </div>
                                        <div className="col-12">
                                            <SearchField setSuggestions={setSuggestions} />
                                        </div>
                                    </div>
                                </div>
                                <div className="card-footer ml-auto mr-auto">
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-12 p4-4 pb-4 mt-4 mb-4">
                                {
                                    suggestions.map((donor, index) => {
                                        return (<DonorSuggestion donor={donor} />)
                                    })
                                    
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
export default DonorSearch;

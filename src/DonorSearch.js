import './App.css';
import React from 'react';
import axios from 'axios';
const API = "https://gzxq65j3m2.execute-api.us-east-1.amazonaws.com/v1";
const ORG = "vsm";

const cache = {};

function search(list, setSuggestions) {
    if (list.length === 0) {
        setSuggestions([]);
        return;
    }
    var promiseList = [];
    var idMap = {};

    list.forEach(s => {
        s = s.toLowerCase().replace(/[^0-9a-z]/g, "");
        idMap[s] = [];
        var url = `${API}/donor/${ORG}/index/${s}`;
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
            console.log(idList);
            setSuggestions(idList);
        });

}

function DonorSuggestion({ donor, onClick }) {
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

    if (info.fullName) {
        return (
            <div className="row pr-4 pl-4">
                <div className="card pr-4 pl-4">
                    <div className="card-header card-header-info card-header-text">
                        <div className="card-text">
                            <h4 className="card-title">{info.fullName.split(" ")[0]}</h4>
                        </div>
                    </div>
                    <div className="card-body simple-border">
                        <div className="row">
                            <div className="col-md-6"><h5>Name:</h5>{info.fullName}</div>
                            <div className="col-sm-8 col-md-4"><h5>Email:</h5>{info.email}</div>
                            <div className="col-sm-4 col-md-2"><h5>Phone:</h5>{info.phone}</div>
                        </div>
                        <div className="row">
                            <div className="col-12"><h5>Address:</h5>{info.address}</div>
                        </div>
                    </div>
                    <div className="card-footer ml-auto mr-auto">
                        <div className="row">
                            <div className="col-12 right">
                                <button type="button" className="btn btn-danger btn-sm m-1" onClick={() => {onClick({showNow: "Add Donation"})}}>Add Donation</button>
                                <button type="button" className="btn btn-danger btn-sm m-1" onClick={() => {onClick({showNow: "Update Donor", parameter: donor})}}>Update</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    } else {
        return <div></div>;
    }
}

function SearchField({ setSuggestions }) {
    const handleChange = (e) => {
        var s = e.target.value;
        var list = s.split(" ");
        list.pop();
        console.log("Invoking Search: " + list);
        search(list, setSuggestions);
    };
    return (
        <input className="form-control" type="text" name="required" required="true"  onChange={handleChange}  />
    );
}

function DonorSearch({onClick}) {
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
                            <div className="col-12 center">
                                <button class="btn btn-sm btn-danger" onClick={() => {onClick({showNow: "Create Donor"})}}>Create Donor</button>
                                <h4>
                                    Search for the donor using name, phone number, email or pan - or any combination of these, separated by space.
                                </h4>
                                <hr/>
                            </div>
                        </div>
                        <div className="row">
                            <div className="card border border-danger">
                                <div className="card-header card-header-danger card-header-text">
                                    <div className="card-text">
                                        <h4 className="card-title">Search</h4>
                                    </div>
                                </div>
                                <div className="card-body">
                                    <div className="row">
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
                                        return (<DonorSuggestion donor={donor} onClick={onClick} />)
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

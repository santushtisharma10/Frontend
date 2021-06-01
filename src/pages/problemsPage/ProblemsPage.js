import React,{useState,useEffect} from 'react';
import Loading from '../logreg/loading.jsx';
import Navbar from '../../components/Header/Navbar';
import FooterSmall from '../../components/Footer/FooterSmall';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Input} from 'reactstrap';
import {Form,Row,Col} from 'react-bootstrap';
import queryString from 'query-string';
import {faSearch} from '@fortawesome/free-solid-svg-icons';
// import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import { getProblems } from "../../actions/problems.actions"
import './ProblemPage.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import update from 'react-addons-update';
import { event } from 'jquery';


function ProblemsPage({info,queryStr}) {

    const creds= JSON.parse(localStorage.getItem("creds"));
    const [error, setErrors] = useState(false);
    const [show, setShow] = useState(true);
    const [problems, setProblems] = useState([]);
    const [modal, setModal] = useState(false);
    const[modalOpenDiffi,setModalOpenDiffi]=useState(false);
    const[modalOpenPlat,setModalOpenPlat]=useState(false);
    const[modalOpenDiffiRange,setModalOpenDiffiRange]=useState(false);
    const [openTags,setOpenTags]=useState(false);

    const [searchText, setSearchText] = useState();
    const [tagText, setTagText] = useState();


    const platforms=[
        "Codechef",
        "Codeforces",
        "Atcoder",
        "Spoj",
        "UVA"
    ];
    const difficultyLevels=[
        "Beginner",
        "Easy" ,
        "Medium",
        "Hard",
        "SuperHard",
        "Challenging"
    ]

    const defaultTags = ["string","dp","math","combinatorics", "Number Theory", "interactive","Binary Search","greedy","graph"];

    const [rangeLeft,setRangeLeft]=useState(0);
    const [rangeRight,setRangeRight]=useState(0);

    const [displayDiff, setDisplayDiff] = useState({
        values:[
            false,false,false,false,false,false
    ]})

    const [displayPlat, setDisplayPlat] = useState({
        values:[
        false,false,false,false,false
    ]})

    const [displayTags, setDisplayTags] = useState({
        values:[
        false,false,false,false,false,false,false,false,false
    ]})


    const platformFilters = [
        'C', 'F', 'A', 'S', 'U'
    ];

    const difficultyFilters = [
        'B','E','M','H','S','C'
    ]

    const [queries,setQueries]=useState({
        difficulty:[],
        platform:[],
        range_l:1200,
        range_r:5000,
        tags:[]
    });


    const[platformQueries, setPlatformQueries]=useState([]);
    const[difficultyQueries, setDifficultyQueries]=useState([]);
    const[tagQueries, setTagQueries]=useState([]);
    // var difficultyQueries=[];
    // var TagQueries=[];

  

    const setLeftRangeQuery = (event) => {
        event.preventDefault();
        setRangeLeft(event.target.value);
    }

    const setRightRangeQuery = (event) => {
        event.preventDefault();
        setRangeRight(event.target.value);
    }

    const toggle = (e) => {
        e.preventDefault();
        setModal(!modal);
      }
    const changePlatformFilter = (event,lev) => {
        // console.log(queryString.stringifyUrl({url: 'https://api.codedigger.tech/problems/', query: {platform: 'F,A',difficulty:'B,E'}}));
        // console.log(queryString.parseUrl('https://foo.bar?foo=b,l&g=k'))
        
        const res=event.target.checked;
        // console.log(lev);
        // console.log(res);
        const platformAdd=platformFilters[lev];
        if(res)
        {
            // queries.platform.push(platformFilters[lev]);
            // setQueries({platform:[...queries.platforms, platformFilters[lev]]});
            // console.log(platformAdd);
            // platformQueries.concat([platformAdd]);
            // var temp=platformQueries.concat([platformAdd]);
            // setPlatformQueries({platformQueries:temp});
            setPlatformQueries([...platformQueries,[platformAdd]]);
            // setDisplayPlat(
            //     result: {                   // object that we want to update
            //         ...prevState.result,    // keep all other key-value pairs
            //         platformAdd: true       // update the value of specific key
            //     }
            // )

            setDisplayPlat(update(displayPlat, {
                values: {
                    [lev]: {
                        $set: true
                    }
                }
            }));

        }
        else
        {
            // setDisplayPlat(prevState => ({
            //     result: {                   // object that we want to update
            //         ...prevState.result,    // keep all other key-value pairs
            //         platformAdd: false       // update the value of specific key
            //     }
            // }))
            const newList = platformQueries.filter((item) => item != platformFilters[lev]);
            setPlatformQueries(newList);
            setDisplayPlat(update(displayPlat, {
                values: {
                    [lev]: {
                        $set: false
                    }
                }
            }));
        }
        // console.log(JSON.stringify(queries.platform).replace(/"/g,'').replace(/]|[[]/g, ''));
        
    }

    const tagTextAdd = (event) => {
        setTagQueries([...tagQueries, [tagText]]);
        setTagText("");
    }

    const changeTagFilter = (event,lev) => {
        // console.log(difficultyFilters[lev]);
        const res=event.target.checked;
        // console.log(lev + res);
        const tagAdd=defaultTags[lev];
        if(res)
        {
            // console.log(queries.difficulty.push(difficultyFilters[lev]));
            setTagQueries([...tagQueries, [tagAdd]]);
            setDisplayTags(update(displayTags, {
                values: {
                    [lev]: {
                        $set: true
                    }
                }
            }));
        }
        else
        {
            // var y=-1;
            // queries.difficulty.map((plat,i) => {
            //     if(plat==difficultyFilters[lev])
            //     {
            //         y=i;
            //     }
            // });
            // queries.difficulty.splice(y,1);
            const newList = tagQueries.filter((item) => item != defaultTags[lev]);
            setTagQueries(newList);

            // console.log(newList);
            // console.log(lev);
            // console.log(defaultTags[lev]);

            setDisplayTags(update(displayTags, {
                values: {
                    [lev]: {
                        $set: false
                    }
                }
            }));
        }
        // console.log(JSON.stringify(queries.difficulty).replace(/"/g,'').replace(/]|[[]/g, ''));
        
    }

    const changeDifficultyFilter = (event,lev) => {
        // console.log(difficultyFilters[lev]);
        const res=event.target.checked;
        // console.log(lev + res);
        const difficultyAdd=difficultyFilters[lev];
        if(res)
        {
            // console.log(queries.difficulty.push(difficultyFilters[lev]));
            setDifficultyQueries([...difficultyQueries, [difficultyAdd]]);
            setDisplayDiff(update(displayDiff, {
                values: {
                    [lev]: {
                        $set: true
                    }
                }
            }));
        }
        else
        {
            // var y=-1;
            // queries.difficulty.map((plat,i) => {
            //     if(plat==difficultyFilters[lev])
            //     {
            //         y=i;
            //     }
            // });
            // queries.difficulty.splice(y,1);
            const newList = difficultyQueries.filter((item) => item != difficultyFilters[lev]);
            setDifficultyQueries(newList);
            setDisplayDiff(update(displayDiff, {
                values: {
                    [lev]: {
                        $set: false
                    }
                }
            }));
        }
        // console.log(JSON.stringify(queries.difficulty).replace(/"/g,'').replace(/]|[[]/g, ''));
        
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        // console.log(queries);
        // console.log(platformQueries);
        // console.log(difficultyQueries);

        // console.log(displayPlat);
        // console.log(tagQueries);
        if(rangeLeft===0 && rangeRight===0)
        {
            const queryy = {
                difficulty:JSON.stringify(difficultyQueries).replace(/"/g,'').replace(/]|[[]/g, ''),
                platform:JSON.stringify(platformQueries).replace(/"/g,'').replace(/]|[[]/g, ''),
                tags:JSON.stringify(tagQueries).replace(/"/g,'').replace(/]|[[]/g, '')
            }

            const finalQ = queryString.stringify(queryy,{skipEmptyString:true});
            const urlTo = `/problems/?${finalQ}`;
            // console.log(urlTo);
            window.location.href=urlTo;
        }
        else
        {
            const queryy = {
                difficulty:JSON.stringify(difficultyQueries).replace(/"/g,'').replace(/]|[[]/g, ''),
                platform:JSON.stringify(platformQueries).replace(/"/g,'').replace(/]|[[]/g, ''),
                tags:JSON.stringify(tagQueries).replace(/"/g,'').replace(/]|[[]/g, ''),
                range_l:JSON.stringify(rangeLeft).replace(/"/g,'').replace(/]|[[]/g, ''),
                range_r:JSON.stringify(rangeRight).replace(/"/g,'').replace(/]|[[]/g, '')
            }

            const finalQ = queryString.stringify(queryy,{skipEmptyString:true});
            const urlTo = `/problems/?${finalQ}`;
            // console.log(urlTo);
            window.location.href=urlTo;
        }
    }

    const handleSearch = (e) => {
        e.preventDefault();
        const searchUrl = `/problems/?search=${searchText}`;
        window.location.href=searchUrl;
    }


    function openNav() {
	    document.getElementById("mySidenav").style.width = "200px";
	}
	function closeNav() {
	    document.getElementById("mySidenav").style.width="0";
	}

    useEffect(() => {
        getProblems(queryStr)
        .then(res => setProblems(res))
        .then(show => setShow(false))
        .catch(error => setErrors(true));
    },[])

    return (
        show==true ? <><Loading/></>:
        <>
            <Navbar />
                <h3
                    style={{
                        textAlign: 'center',
                        marginBottom: '65px',
                        marginTop: '100px'
                    }}
                >Problems</h3>
                <Button  style={{position:'absolute', bottom:'77vh', right:'6vw'}} onClick={openNav}>Filter</Button>
                
                <div id="mySidenav" className="sidenav">
		        
         
                            <Button className="filterHeading" onClick={(e)=>setModalOpenDiffi(!modalOpenDiffi)}>Difficulty</Button>
                             <Modal isOpen={modalOpenDiffi}><ModalBody>
                             <h2 style={{marginBottom:'2rem'}}>Difficulty</h2>
                            <Form style={{marginBottom:'1rem'}}>
                                <div key="inline-checkbox">
                                    {difficultyLevels.map((lev,i) => {
                                        if(displayDiff.values[i])
                                        {
                                            return(
                                                <Form.Check checked={true} onChange={(event) => changeDifficultyFilter(event,i)} inline label={lev} type="checkbox" id={`inline-${lev}-${i}`} />
                                            )
                                        }
                                        else
                                        {
                                            return(
                                                <Form.Check onChange={(event) => changeDifficultyFilter(event,i)} inline label={lev} type="checkbox" id={`inline-${lev}-${i}`} />
                                            )
                                        }
                                        
                                    })}
                                </div></Form>
                                <Button onClick={(e)=>setModalOpenDiffi(false)}>Set</Button>
                            </ModalBody></Modal>
                        
                            <Button className="filterHeading" onClick={(e)=>setOpenTags(!openTags)}>Tags</Button>
                             <Modal isOpen={openTags}><ModalBody>
                             <h2 style={{marginBottom:'2rem'}}>Tags</h2>
                                <Form style={{marginBottom:'1rem'}}>
                                    <div key="inline-checkbox">
                                        {defaultTags.map((lev,i) => {
                                            if(displayTags.values[i])
                                            {
                                                return(
                                                    <Form.Check checked={true} onChange={(event) => changeTagFilter(event,i)} inline label={lev} type="checkbox" id={`inline-${lev}-${i}`} />
                                                )
                                            }
                                            else
                                            {
                                                return(
                                                    <Form.Check onChange={(event) => changeTagFilter(event,i)} inline label={lev} type="checkbox" id={`inline-${lev}-${i}`} />
                                                )
                                            }
                                        })}
                                    </div>
                                    <div>
                                    <Form.Group as={Row} onSubmit={e => { e.preventDefault(); }} style={{marginTop:'1rem'}}>
                                        <Form.Label column sm="3" style={{maxWidth:'18%'}}>
                                            Your Tag
                                        </Form.Label>
                                        <Col sm="8">
                                        <Form.Control onKeyPress={event => {
                                                if (event.key === "Enter") {
                                                    event.preventDefault();
                                                    tagTextAdd();
                                                }
                                                }} value={tagText} onChange={(e)=>setTagText(e.target.value)} type="text"  placeholder="Type your Tag" />
                                        </Col>
                                        <Col sm="1" style={{paddingLeft:'0'}}>
                                        <Button onClick={tagTextAdd}>Add</Button>
                                        </Col>
                                        
                                    </Form.Group>
                                    </div>
                                </Form>
                                <Row style={{marginBottom:'2rem'}}>
                                    <Col sm='3'>Your Tags</Col>
                                    <Col sm='9'>
                                        <div style={{display:'flex', justifyContent:'space-evenly'}}>
                                            {tagQueries.map((quer) => {
                                                return(
                                                    <>
                                                    <div 
                                                        style={{
                                                            padding:'0.4rem', 
                                                            color:'black', 
                                                            backgroundColor:'powderblue', 
                                                            borderRadius:'4px',
                                                        }}
                                                    >
                                                        {quer} 

                                                    </div></>
                                                )
                                            })}
                                        </div>
                                    </Col>
                                </Row>
                                <Button onClick={(e)=>setOpenTags(false)}>Set</Button>
                            </ModalBody> </Modal>   <br></br><br></br>
                       
                        <Button className="filterHeading" onClick={(e)=>setModalOpenPlat(!modalOpenPlat)}>Platforms</Button>
                             <Modal isOpen={modalOpenPlat}><ModalBody>
                             <h2 style={{marginBottom:'2rem'}}>Platforms</h2>
                            <Form style={{marginBottom:'1rem'}}>
                                <div key="inline-checkbox">
                                    {platforms.map((lev,i) => {
                                        // console.log(`${displayPlat.values[i]}`)
                                        if(displayPlat.values[i])
                                        {
                                            return(
                                                <Form.Check checked={true} onChange={(event) => changePlatformFilter(event,i)} inline label={lev} type="checkbox" id={`inline-${lev}-${i}`} />
                                            )
                                        }
                                        else
                                        {
                                            return(
                                                <Form.Check checked={false} onChange={(event) => changePlatformFilter(event,i)} inline label={lev} type="checkbox" id={`inline-${lev}-${i}`} />
                                            )
                                        }
                                        
                                    })}
                                </div>
                        </Form>
                        <Button onClick={(e)=>setModalOpenPlat(false)}>Set</Button>
                            </ModalBody></Modal>
                      <br></br><br></br>
                      <Button className="filterHeading" onClick={(e)=>setModalOpenDiffiRange(!modalOpenDiffiRange)}>Difficulty Range</Button>
                             <Modal isOpen={modalOpenDiffiRange}><ModalBody>
                        <Form inline>
                       
                            <label style={{marginRight:'20px',padding:'4px'}}>
                                Range Left
                                <input style={{width:'100px',height:'32px',marginLeft:'11px'}} onChange={setLeftRangeQuery} type="number"/>
                            </label>
                            <br></br>
                            <label style={{padding:'4px'}}>
                                Range Right
                                <input style={{width:'100px',height:'32px',marginLeft:'11px'}} onChange={setRightRangeQuery} type="number"/>
                            </label>
                        </Form>
                        <Button onClick={(e)=>setModalOpenDiffiRange(false)}>Set</Button>
                       </ModalBody> </Modal>
                        <br></br> <br></br>  
                    
                        <Button style={{padding:'6px',marginLeft:'12px'}}onClick={handleSubmit}>Apply</Button>
                        <Button style={{padding:'6px',marginLeft:'5px'}} onClick={closeNav}>Close</Button>
		</div>
                
                {/**            */}

	
		
                
            {!problems.result? (<Loading />) : 
                (
                    <>
                    <div style={{
                        margin: '0px',
                        padding: '0px',
                        marginLeft: '100px',
                        marginRight: '100px',
                        paddingBottom:'100px'
                    }}>
                        <div className="row" style={{marginBottom:'3rem'}}>
                            <div class="input-group" style={{justifyContent:'center'}}>
                                <div class="form-outline">
                                    <input onChange={(e)=>setSearchText(e.target.value)} type="search" id="form1" class="form-control" style={{height:'3rem', width:'26rem'}}/>
                                </div>
                                <button type="button" onClick={handleSearch} class="btn btn-primary">
                                    Search 
                                </button>
                            </div>
                        </div>
                        <div className="row">
                            
                            {problems.result.map((playlist, i) => {
                                return(
                                    <>
                                    
                                    <ul className="list list-inline" style={{marginTop: '-14px'}}>
                                        <li className="d-flex justify-content-between">
                                            <div className="d-flex flex-row align-items-center">
                                                <div className="ml-2">
                                                    <h5 className="mb-0 link_ques">{i+1}. <a href={playlist.url} className="link_ques">{playlist.name}</a></h5>
                                                    <div className="d-flex flex-row mt-1 text-black-50 date-time">
                                                        <div><span className="ml-3 black">Platform: {playlist.platform},</span></div>
                                                        <div><span className="ml-2 black">Tags: {playlist.tags},</span></div>
                                                        <div><span className="ml-2 black">Difficulty: {playlist.difficulty},</span></div>
                                                        <div><span className="ml-2 black">Rating: {playlist.rating}</span></div>
                                                        
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="d-flex justify-content-around">
                                            {playlist.solved? (
                                                <>
                                                <a href={playlist.url} target="_blank"
                                                    style={{
                                                        color: 'white',
                                                        backgroundColor: 'green',
                                                        borderRadius: '15px',
                                                        width: '37%',
                                                        marginRight: '50px',
                                                        outline: 'none',
                                                        textAlign: 'center',
                                                        paddingTop: '10px',
                                                        textDecoration: 'none',
                                                        fontSize: '15px',
                                                        opacity: '0.7'
                                                    }}
                                                >Solved</a>
                                        </>
                                            ): (
                                                <>
                                                        <a href={playlist.url} target="_blank"
                                                    style={{
                                                        color: 'white',
                                                        backgroundColor: 'blue',
                                                        borderRadius: '15px',
                                                        width: '100px',
                                                        marginRight: '30px',
                                                        outline: 'none',
                                                        textAlign: 'center',
                                                        paddingTop: '10px',
                                                        textDecoration: 'none',
                                                        fontSize: '15px',
                                                        opacity: '0.9'
                                                    }}
                                                >Solve</a>
                                                </>
                                            )}
                                            </div>
                                        </li>
                                    </ul>
                                
                            
                                    </>
                                )
                            })}
                        </div>      
                        </div>
                        
                                <FooterSmall/>
                            
                            </>
                    
                )
            }
        </>
    )
}

export default ProblemsPage

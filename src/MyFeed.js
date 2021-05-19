import React, {useState} from 'react';
import fire from './fire';

const MyFeed = (user) => {
    const [props, setProps] = useState([]);
    const userId = fire.auth().currentUser.uid;
    const [edit, setEdit] = useState(false);
    const [del, setDel] = useState(false);
    const [createBox, setCreateBox] = useState(false);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const objs = [];

    /*
        TODO:
        - nr de telefon (legat de fiecare anunt, nou camp)
        - afisare nr de tel pe pagina anunt
        - cereri (trimitere/primire/acceptare/refuz)
        - nou field in database sub id user:
                - cerere
    */

    let p = []
    fire.database().ref('/posts').once('value', snap => {
        snap.forEach(child => {
            p.unshift(child.val());
            p[0].key = child.key;
            //console.log(p[0]);
            //console.log(child.key);
            //console.log(p);
            //console.log(p[0]);
        });
        //console.log(snap.val());
        //console.log(props.length)
        //p.reverse();
        if(props.length === 0)setProps(p);
    }).then(() => {
        
    })

    console.log(props);
    console.log(userId);

    function refreshPage () {
        //console.log('plm');
        setEdit(false);
        setDel(false);
        setTimeout(function () {
            window.location.reload(true);
            }, 1000);
    }

    function handleEdit () {
            var current = new Date();
            console.log(current.toLocaleString());
            fire.database().ref('posts/' + props[edit].key).set({
                title: title,
                description: description,
                userId: userId,
                name: props[edit].name,
                job: props[edit].job,
                posttime: current.toLocaleString(),
            }).then(refreshPage())
    }

    function editButton (i) {
        if(edit === false)
            setEdit(i);
        setTitle(props[i].title);
        setDescription(props[i].description);
    }

    function deleteButton (index) {
        if(del === false)
            setDel(index);
    }

    function handleDelete () {
        fire.database().ref('posts/' + props[del].key).remove().then(refreshPage())
    }


    for(let i = 0; i < props.length; i++) {
        // console.log(p[i].description);
        if(props[i].userId === userId)
            objs.push(
                <div className="feedContainer" key={i}>
                    <label className="deleteBtn" onClick={() => (deleteButton(i))}>Șterge Anunț</label>
                    <label>
                        {props[i].title}
                    </label>
                    <label className="meta">
                    {props[i].description}<br/><br/>
                    Postat de: <text id="author">{props[i].name}</text> la data de: {props[i].posttime}.
                    </label>
                    <button onClick={() => {editButton(i)}} > Editează Anunț </button>
                </div>
            );
    }

    // objs.push(obj);
    // objs.push(obj);
    // objs.push(obj);


    return (

        <><>
            {edit !== false &&
                <div className="createBox">
                    Editare anunț
                <label> Titlu </label>
                    <input type="text"
                        autoFocus required value={title}
                        onChange={(e) => setTitle(e.target.value)} />
                    <label> Detalii anunț</label>
                    <textarea
                        id="description"
                        autoFocus required value={description}
                        placeholder="Recomandăm cât mai multe detalii"
                        onChange={(e) => setDescription(e.target.value)} />

                    <span id='close' onClick={() => {setEdit(false)}} >
                                                                    închide fereastra</span>
                    <div className="btnContainer">
                        <>
                            <button onClick={handleEdit} > Salvează </button>
                        </>
                    </div>
                </div>
            }
            {del !== false &&
                <div className="deleteBox">
                    Ești sigur că vrei să ștergi anunțul?
                        <>
                            <button onClick={handleDelete} > Da </button>
                            <button onClick={() => {setDel(false); console.log("cv")}} > Nu </button>
                        </>
                </div>
            }
        </>
            <div className="feed">
                Vezi anunțurile tale:
            {objs}
            </div>
        </>
    )

}

export default MyFeed;
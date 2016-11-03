/* global ReactDOM */

// This is the react template,called from showMessageDialog later
function MessageDialog(props) {
    return (
        <div className={"alert alert-dismissable " + props.type} role="alert">
            <button type="button" className="close" aria-label="Close" onClick={() => {removeMessageDialog(props.id)}}>
                <span aria-hidden="true">&times;</span>
            </button>
            {props.message}
        </div>
    )
}

class MessageArea extends React.Component {
    render() {
        const messageDialogs = this.props.messages.map((element) => {
            return <MessageDialog type={element.type} message={element.message} key={element.key} id={element.key}/>
        });
        return <div>{messageDialogs}</div>
    }
}

/**
 * This function generates consecutive uids starting from 0
 */
var uid = (() => {
    var id=0;
    return () => id++;
})();

let messages = [];

/**
 * This function appends a bootstrap dialog to the message area with the given message and type
 * @param {type} message - The text that should be shown in the dialog
 * @param {type} type - The type (color) of the dialog. Possible values: alert-success, alert-warning, alert-danger, alert-info (default)
 * @returns {void}
 */
function showMessageDialog(message, type){
    var knownTypes = ['alert-success', 'alert-warning', 'alert-danger', 'alert-info'];
    if(knownTypes.indexOf(type) === -1){
        var shortTypes = ['success', 'warning', 'danger', 'info'];
        if(shortTypes.indexOf(type) === -1){
            type = 'alert-info';
        } else {
            type = "alert-" + type;
        }
    }
    messages.push({message: message, type: type, key: uid()});
    updateMessageDialogs();
}

function removeMessageDialog(key) {
    messages = messages.filter(message => message.key !== key);
    updateMessageDialogs();
}

function updateMessageDialogs() {
    ReactDOM.render(
        <MessageArea messages={messages}/>,
        document.getElementById('global-message-area')
    );
}
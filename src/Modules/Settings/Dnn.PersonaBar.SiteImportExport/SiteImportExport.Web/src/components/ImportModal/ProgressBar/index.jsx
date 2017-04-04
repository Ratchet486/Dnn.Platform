import React, { PropTypes, Component } from "react";
import { connect } from "react-redux";
import {
    importExport as ImportExportActions
} from "actions";
import { Line } from "rc-progress";
import "./style.less";

class ProgressBar extends Component {
    constructor() {
        super();

        this.timeout = "";
        this.started = false;
        this.state = {
            percent: 0
        };
    }

    componentDidMount() {
        this.started = true;
        this.increase();
    }

    componentWillUnmount() {
        clearTimeout(this.timeout);
        this.setState({ percent: 0 });
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.visible !== undefined) {

            if (!nextProps.visible && this.started) {
                this.started = false;
                this.setState({ percent: 0 });
                clearTimeout(this.timeout);
            }

            if (nextProps.visible && !this.started) {
                this.started = true;
                this.setState({ percent: 0 });
                this.increase();
            }
        }
    }

    increase() {
        if (this.state.percent > 95) {
            //clearTimeout(this.timeout);
            this.setState({ percent: 0 });
        }
        else {
            if (this.props.loaded) {
                this.setState({
                    percent: (100)
                }, () => {
                    this.timeout = setTimeout(() => {
                        this.props.dispatch(ImportExportActions.packageVerified(true));
                    }, 500);
                });
            }
            else {
                this.setState({
                    percent: (this.state.percent + 5)
                });
            }
        }
        this.timeout = setTimeout(() => {
            this.increase();
        }, 1000);
    }

    render() {
        let visibility = this.props.visible ? "block" : "none";

        return (
            <div id="progressContainer" className={this.props.className} style={{ display: visibility }}>
                <Line
                    percent={this.state.percent}
                    strokeWidth={5}
                    trailWidth={5}
                    strokeLinecap={'square'}
                    trailColor={'#eff0f0'}
                    strokeColor={'#9fdbf0'} />
            </div>
        );
    }
}

ProgressBar.propTypes = {
    dispatch: PropTypes.func.isRequired,
    visible: PropTypes.bool,
    className: PropTypes.string,
    loaded: PropTypes.bool
};

function mapStateToProps(state) {
    return {

    };
}

export default connect(mapStateToProps)(ProgressBar);
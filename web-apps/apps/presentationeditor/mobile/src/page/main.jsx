import React, { Component, Fragment } from 'react';
import { f7, Page, View, Navbar, Subnavbar, Icon, Link} from 'framework7-react';
import { observer, inject } from "mobx-react";
import { Device } from '../../../../common/mobile/utils/device';

import EditOptions from '../view/edit/Edit';
import AddOptions from '../view/add/Add';
import Settings from '../view/settings/Settings';
import { Collaboration } from '../../../../common/mobile/lib/view/collaboration/Collaboration.jsx';
import { Preview } from "../controller/Preview";
import { Search, SearchSettings } from '../controller/Search';
import ContextMenu from '../controller/ContextMenu';
import { Toolbar } from "../controller/Toolbar";
import { AddLinkController } from '../controller/add/AddLink';
import { EditLinkController } from '../controller/edit/EditLink';

class MainPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            editOptionsVisible: false,
            addOptionsVisible: false,
            settingsVisible: false,
            collaborationVisible: false,
            previewVisible: false,
            addLinkSettingsVisible: false,
            editLinkSettingsVisible: false
        };
    }

    onClosePreview = () => {
        this.setState({previewVisible: false});
    }

    handleClickToOpenOptions = (opts, showOpts) => {
        f7.popover.close('.document-menu.modal-in', false);

        setTimeout(() => {
            let opened = false;
            const newState = {};
            if ( opts === 'edit' ) {
                this.state.editOptionsVisible && (opened = true);
                newState.editOptionsVisible = true;
            } else if ( opts === 'add' ) {
                this.state.addOptionsVisible && (opened = true);
                newState.addOptionsVisible = true;
                newState.addShowOptions = showOpts;
            } else if ( opts === 'settings' ) {
                this.state.settingsVisible && (opened = true);
                newState.settingsVisible = true;
            } else if ( opts === 'coauth' ) {
                this.state.collaborationVisible && (opened = true);
                newState.collaborationVisible = true;
            } else if ( opts === 'preview' ) {
                this.state.previewVisible && (opened = true);
                newState.previewVisible = true;
            } else if ( opts === 'add-link') {
                this.state.addLinkSettingsVisible && (opened = true);
                newState.addLinkSettingsVisible = true;
            } else if( opts === 'edit-link') {
                this.state.editLinkSettingsVisible && (opened = true);
                newState.editLinkSettingsVisible = true;
            }

            for (let key in this.state) {
                if (this.state[key] && !opened) {
                    setTimeout(() => {
                        this.handleClickToOpenOptions(opts, showOpts);
                    }, 10);
                    return;
                }
            }

            if (!opened) {
                this.setState(newState);
                if ((opts === 'edit' || opts === 'coauth') && Device.phone) {
                    f7.navbar.hide('.main-navbar');
                }
            }
        }, 10);
    };

    handleOptionsViewClosed = opts => {
        setTimeout(() => {
            this.setState(state => {
                if ( opts == 'edit' )
                    return {editOptionsVisible: false};
                else if ( opts == 'add' )
                    return {addOptionsVisible: false, addShowOptions: null};
                else if ( opts == 'settings' )
                    return {settingsVisible: false};
                else if ( opts == 'coauth' )
                    return {collaborationVisible: false}
                else if ( opts == 'preview' )
                    return {previewVisible: false};
                else if ( opts === 'add-link') 
                    return {addLinkSettingsVisible: false};
                else if( opts === 'edit-link') 
                    return {editLinkSettingsVisible: false};
            });
            if ((opts === 'edit' || opts === 'coauth') && Device.phone) {
                f7.navbar.show('.main-navbar');
            }
        });
    };

    componentDidMount () {
        if ( $$('.skl-container').length )
            $$('.skl-container').remove();
    }

    render() {
        const appOptions = this.props.storeAppOptions;
        const config = appOptions.config;
        const isShowPlaceholder = !appOptions.isDocReady && (!config.customization || !(config.customization.loaderName || config.customization.loaderLogo));

        let isHideLogo = true,
            isCustomization = true,
            isBranding = true;

        if (!appOptions.isDisconnected && config?.customization) {
            isCustomization = !!(config.customization && (config.customization.loaderName || config.customization.loaderLogo));
            isBranding = appOptions.canBranding || appOptions.canBrandingExt;

            if (!Object.keys(config).length) {
                isCustomization = !/&(?:logo)=/.test(window.location.search);
            }

            isHideLogo = isCustomization && isBranding; 
        }

        return (
            <Fragment>
                {!this.state.previewVisible ? null : <Preview onclosed={this.handleOptionsViewClosed.bind(this, 'preview')} />}
                <Page name="home" className={`editor${!isHideLogo ? ' page-with-logo' : ''}`}>
                    {/* Top Navbar */}
                    <Navbar id='editor-navbar'
                            className={`main-navbar${!isHideLogo ? ' navbar-with-logo' : ''}`}>
                        {!isHideLogo && <div className="main-logo" onClick={() => {
                            window.open(`${__PUBLISHER_URL__}`, "_blank");
                        }}><Icon icon="icon-logo"></Icon></div>}
                        <Subnavbar>
                            <Toolbar openOptions={this.handleClickToOpenOptions}
                                     closeOptions={this.handleOptionsViewClosed}/>
                            <Search useSuspense={false}/>
                        </Subnavbar>
                    </Navbar>
                    {/* Page content */}
                    <View id="editor_sdk" />

                    {isShowPlaceholder ?
                        <div className="doc-placeholder">
                            <div className="slide-h">
                                <div className="slide-v">
                                    <div className="slide-container">
                                        <div className="line"></div>
                                        <div className="line empty"></div>
                                        <div className="line"></div>
                                    </div>
                                </div>
                            </div>
                        </div> :
                        null
                    }

                    <SearchSettings useSuspense={false} />

                    {
                        !this.state.editOptionsVisible ? null :
                            <EditOptions onclosed={this.handleOptionsViewClosed.bind(this, 'edit')} />
                    }
                    {
                        !this.state.addOptionsVisible ? null :
                            <AddOptions onCloseLinkSettings={this.handleOptionsViewClosed.bind(this)} onclosed={this.handleOptionsViewClosed.bind(this, 'add')} showOptions={this.state.addShowOptions} />
                    }
                    {
                        !this.state.addLinkSettingsVisible ? null :
                            <AddLinkController onClosed={this.handleOptionsViewClosed.bind(this)} />
                    }
                    {
                        !this.state.editLinkSettingsVisible ? null :
                            <EditLinkController onClosed={this.handleOptionsViewClosed.bind(this)} />
                    }
                    {
                        !this.state.settingsVisible ? null :
                            <Settings openOptions={this.handleClickToOpenOptions} onclosed={this.handleOptionsViewClosed.bind(this, 'settings')} />
                    }
                    {
                        !this.state.collaborationVisible ? null :
                            <Collaboration onclosed={this.handleOptionsViewClosed.bind(this, 'coauth')} />
                    }
                    {appOptions.isDocReady && <ContextMenu openOptions={this.handleClickToOpenOptions.bind(this)} />}   
                </Page>
            </Fragment>
        )
    }
}

export default inject("storeAppOptions")(observer(MainPage));
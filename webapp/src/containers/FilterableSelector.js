import _ from 'lodash';
import React, {Component, PropTypes} from 'react';
import classNames from 'classnames'
import '../css/FilterableSelector.css';

class FilterableItem extends Component {
    static propTypes = {
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      selected: PropTypes.bool.isRequired
    }

    render() {
      const cssClasses = classNames({
        'ui button orange active item': this.props.selected,
        'ui button item': !this.props.selected,
        'fiterable-list-item': true
      })

      return (
        <li
           key={this.props.id}
           className={cssClasses}
           onClick={this.props.onClick}
           >
          <a>
            {this.props.name}
          </a>
        </li>
      )
    }
}

class FilterableSelector extends Component {
  constructor(props) {
    super(props)

    const {multiple} = props
    let {selectedIds} = props

    if (!multiple) {
      const first = _.first(selectedIds)
      selectedIds = first ? [first]: []
    }

    this.state = {
      filter: '',
      selectedIds: selectedIds
    }
  }

  static propTypes = {
    items: PropTypes.object.isRequired,
    selectedIds: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired,
    fetching: PropTypes.bool,
    multiple: PropTypes.bool,
    onChange: PropTypes.func.isRequired,
    placeHolderText: PropTypes.string,
    loadingText: PropTypes.string,
    onClose: PropTypes.func,
  }

  componentWillReceiveProps(nextProps) {
    const {selectedIds} = nextProps
    this.setState({
      selectedIds
    })
  }

  onFilter(value) {
    this.setState({
      filter: value
    })
  }

  onItemClick(id) {
    let {selectedIds} = this.state
    const {multiple} = this.props
    const indexOf = _.indexOf(selectedIds, id)

    if (multiple) {
      if (indexOf === -1) {
        selectedIds = [...selectedIds, id]
      } else {
        selectedIds = [...selectedIds.slice(0, indexOf),
                       ...selectedIds.slice(indexOf + 1, selectedIds.length)]
      }
    }
    else {
      selectedIds = [id]
    }

    this.setState({
      selectedIds
    })

    this.props.onChange(selectedIds)
  }

  renderItems() {
    if (this.props.fetching) {
      return (
        <div className='fetching'>
        {this.props.loadingText}
        </div>
      )
    }
    const filter = this.state.filter || ''
    const keys = _.keys(this.props.items)

    return keys.map(key => {
      const item = this.props.items[key]
      if (!item.name.includes(filter)) {
        return null;
      }
      const selected = _.includes(this.state.selectedIds, key)

      return <FilterableItem
        key={key}
        id={key}
        name={item.name}
        selected={selected}
        onClick={() => this.onItemClick(key)}
      />

    })
  }

  render() {
    return (
      <div className='fiterable-selector'>
        <div className='ui fluid input'>
          <input
             type='text'
             placeholder={this.props.placeHolderText}
             value={this.state.filter}
             onChange={(e) => {this.onFilter(e.target.value)}}
          />
        </div>
        <ul className='item-list'>
          {this.renderItems()}
        </ul>
        <div className='btn-close'>
          <button className='ui button btn-orange'
                  onClick={(e) => this.props.onClose()}>Close</button>
        </div>
      </div>
    )
  }
}

export default FilterableSelector;

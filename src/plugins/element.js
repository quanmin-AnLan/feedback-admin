import Vue from 'vue'

import Alert from 'element-ui/lib/alert'
import Badge from 'element-ui/lib/badge'
import Button from 'element-ui/lib/button'
import Card from 'element-ui/lib/card'
import Checkbox from 'element-ui/lib/checkbox'
import CheckboxGroup from 'element-ui/lib/checkbox-group'
import Container from 'element-ui/lib/container'
import Dialog from 'element-ui/lib/dialog'
import Dropdown from 'element-ui/lib/dropdown'
import DropdownItem from 'element-ui/lib/dropdown-item'
import DropdownMenu from 'element-ui/lib/dropdown-menu'
import Empty from 'element-ui/lib/empty'
import Form from 'element-ui/lib/form'
import FormItem from 'element-ui/lib/form-item'
import Header from 'element-ui/lib/header'
import Image from 'element-ui/lib/image'
import Input from 'element-ui/lib/input'
import InputNumber from 'element-ui/lib/input-number'
import Main from 'element-ui/lib/main'
import Menu from 'element-ui/lib/menu'
import MenuItem from 'element-ui/lib/menu-item'
import Option from 'element-ui/lib/option'
import Pagination from 'element-ui/lib/pagination'
import Radio from 'element-ui/lib/radio'
import RadioGroup from 'element-ui/lib/radio-group'
import Select from 'element-ui/lib/select'
import Table from 'element-ui/lib/table'
import TableColumn from 'element-ui/lib/table-column'
import Tag from 'element-ui/lib/tag'
import Tooltip from 'element-ui/lib/tooltip'
import DatePicker from 'element-ui/lib/date-picker'

import Loading from 'element-ui/lib/loading'
import Message from 'element-ui/lib/message'
import MessageBox from 'element-ui/lib/message-box'

import 'element-ui/lib/theme-chalk/base.css'
import 'element-ui/lib/theme-chalk/icon.css'
import 'element-ui/lib/theme-chalk/alert.css'
import 'element-ui/lib/theme-chalk/badge.css'
import 'element-ui/lib/theme-chalk/button.css'
import 'element-ui/lib/theme-chalk/button-group.css'
import 'element-ui/lib/theme-chalk/card.css'
import 'element-ui/lib/theme-chalk/checkbox.css'
import 'element-ui/lib/theme-chalk/container.css'
import 'element-ui/lib/theme-chalk/dialog.css'
import 'element-ui/lib/theme-chalk/dropdown.css'
import 'element-ui/lib/theme-chalk/dropdown-item.css'
import 'element-ui/lib/theme-chalk/dropdown-menu.css'
import 'element-ui/lib/theme-chalk/empty.css'
import 'element-ui/lib/theme-chalk/form.css'
import 'element-ui/lib/theme-chalk/form-item.css'
import 'element-ui/lib/theme-chalk/header.css'
import 'element-ui/lib/theme-chalk/image.css'
import 'element-ui/lib/theme-chalk/input.css'
import 'element-ui/lib/theme-chalk/input-number.css'
import 'element-ui/lib/theme-chalk/main.css'
import 'element-ui/lib/theme-chalk/menu.css'
import 'element-ui/lib/theme-chalk/menu-item.css'
import 'element-ui/lib/theme-chalk/option.css'
import 'element-ui/lib/theme-chalk/pagination.css'
import 'element-ui/lib/theme-chalk/popper.css'
import 'element-ui/lib/theme-chalk/radio.css'
import 'element-ui/lib/theme-chalk/radio-group.css'
import 'element-ui/lib/theme-chalk/scrollbar.css'
import 'element-ui/lib/theme-chalk/select.css'
import 'element-ui/lib/theme-chalk/select-dropdown.css'
import 'element-ui/lib/theme-chalk/table.css'
import 'element-ui/lib/theme-chalk/table-column.css'
import 'element-ui/lib/theme-chalk/tag.css'
import 'element-ui/lib/theme-chalk/tooltip.css'
import 'element-ui/lib/theme-chalk/date-picker.css'
import 'element-ui/lib/theme-chalk/time-picker.css'
import 'element-ui/lib/theme-chalk/time-select.css'

import 'element-ui/lib/theme-chalk/loading.css'
import 'element-ui/lib/theme-chalk/message.css'
import 'element-ui/lib/theme-chalk/message-box.css'

;[
  Alert,
  Badge,
  Button,
  Card,
  Checkbox,
  CheckboxGroup,
  Container,
  Dialog,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  Empty,
  Form,
  FormItem,
  Header,
  Image,
  Input,
  InputNumber,
  Main,
  Menu,
  MenuItem,
  Option,
  Pagination,
  Radio,
  RadioGroup,
  Select,
  Table,
  TableColumn,
  Tag,
  Tooltip,
  DatePicker
].forEach((c) => Vue.use(c))

Vue.use(Loading.directive)

Vue.prototype.$loading = Loading.service
Vue.prototype.$message = Message
Vue.prototype.$confirm = MessageBox.confirm
Vue.prototype.$alert = MessageBox.alert
Vue.prototype.$prompt = MessageBox.prompt
Vue.prototype.$msgbox = MessageBox

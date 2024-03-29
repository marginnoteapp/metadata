import {
  type NSIndexPath,
  type UITableView,
  MN,
  openUrl,
  postNotification
} from "marginnote"
import { Addon } from "~/addon"
import { checkInputCorrect, DataSourceSectionKeyUnion } from "~/merged"
import {
  CellViewType,
  type IRowInput,
  type IRowSelect,
  type IRowSwitch
} from "~/typings"
import { byteLength } from "~/utils"
import lang from "./lang"
import { _isModuleOFF } from "./settingView"

function _tag2indexPath(tag: number): NSIndexPath {
  return NSIndexPath.indexPathForRowInSection(
    (tag - 999) % 100,
    (tag - 999 - ((tag - 999) % 100)) / 100
  )
}

async function tableViewDidSelectRowAtIndexPath(
  tableView: UITableView,
  indexPath: NSIndexPath
) {
  tableView.cellForRowAtIndexPath(indexPath).selected = false
  const sec = self.dataSource[indexPath.section]
  const row = sec.rows[indexPath.row]
  switch (row.type) {
    case CellViewType.PlainText:
      if (row.link) openUrl(row.link)
      break
    case CellViewType.ButtonWithInput:
    case CellViewType.Button:
      if (sec.key === "magicaction")
        postNotification(Addon.key + "ButtonClick", {
          row
        })
      break
    case CellViewType.Expland: {
      row.status = !row.status
      self.tableView.reloadData()
      postNotification(Addon.key + "SwitchChange", {
        name: sec.key,
        key: row.key,
        status: row.status
      })
    }
  }
}

async function textFieldShouldReturn(sender: UITextField) {
  const indexPath: NSIndexPath = _tag2indexPath(sender.tag)
  const section = self.dataSource[indexPath.section]
  const row = section.rows[indexPath.row] as IRowInput
  const text = sender.text.trim()
  // Allowed be empty
  if (/^marginnote3app:/.test(text)) openUrl(text)
  if (!text || (await checkInputCorrect(text, row.key))) {
    // Cancel the cursor if the input is correct
    sender.resignFirstResponder()
    row.content = text
    postNotification(Addon.key + "InputOver", {
      name: section.key,
      key: row.key,
      content: text
    })
  }
  return true
}

function switchChange(sender: UISwitch) {
  const indexPath: NSIndexPath = _tag2indexPath(sender.tag)
  const section = self.dataSource[indexPath.section]
  const row = <IRowSwitch>section.rows[indexPath.row]
  row.status = !row.status
  self.tableView.reloadData()
  postNotification(Addon.key + "SwitchChange", {
    name: section.key,
    key: row.key,
    status: row.status
  })
}

let lastSelectInfo:
  | {
      name: DataSourceSectionKeyUnion
      key: string
      selections: number[]
    }
  | undefined
async function selectAction(param: {
  indexPath: NSIndexPath
  selection: number
  menuController: MenuController
}) {
  const { indexPath, selection, menuController } = param
  const section = self.dataSource[indexPath.section]
  const row = <IRowSelect>section.rows[indexPath.row]
  //  Distinguish between single and multiple selection
  if (
    (<IRowSelect>self.dataSource[indexPath.section].rows[indexPath.row]).type ==
    CellViewType.Select
  ) {
    ;(<IRowSelect>(
      self.dataSource[indexPath.section].rows[indexPath.row]
    )).selections = [selection]
    postNotification(Addon.key + "SelectChange", {
      name: section.key,
      key: row.key,
      selections: [selection]
    })
    if (self.popoverController)
      self.popoverController.dismissPopoverAnimated(true)
  } else {
    const selections = row.selections

    const nowSelect = row.selections.includes(selection)
      ? selections.filter(item => item != selection)
      : [selection, ...selections]
    ;(<IRowSelect>(
      self.dataSource[indexPath.section].rows[indexPath.row]
    )).selections = nowSelect

    lastSelectInfo = {
      name: section.key,
      key: row.key,
      selections: nowSelect.sort()
    }
    menuController.commandTable = menuController.commandTable?.map(
      (item, index) => {
        item.checked = row.selections.includes(index)
        return item
      }
    )
    menuController.menuTableView!.reloadData()
  }
  self.tableView.reloadData()
}

function clickSelectButton(sender: UIButton) {
  const indexPath: NSIndexPath = _tag2indexPath(sender.tag)
  const section = self.dataSource[indexPath.section]
  const row = section.rows[indexPath.row] as IRowSelect
  const menuController = MenuController.new()
  const height = 44
  const zero = 0.00001

  menuController.commandTable = row.option.map((item, index) => ({
    title: item,
    object: self,
    selector: "selectAction:",
    height: height,
    param: {
      indexPath,
      menuController,
      selection: index
    },
    checked: row.selections.includes(index)
  }))
  const width = Math.max(...row.option.map(k => byteLength(k))) * 10 + 80
  menuController.preferredContentSize = {
    width: width > 300 ? 300 : width,
    height:
      height * menuController.commandTable.filter(k => k.height !== zero).length
  }

  const studyControllerView = MN.studyController.view
  self.popoverController = new UIPopoverController(menuController)
  self.popoverController.presentPopoverFromRect(
    sender.convertRectToView(sender.bounds, studyControllerView),
    studyControllerView,
    1 << 3,
    true
  )
  self.popoverController.delegate = self
}

/** Send data when the popup disappears */
function popoverControllerDidDismissPopover() {
  if (lastSelectInfo) {
    postNotification(Addon.key + "SelectChange", lastSelectInfo)
    lastSelectInfo = undefined
  }
}

export default {
  popoverControllerDidDismissPopover,
  tableViewDidSelectRowAtIndexPath,
  textFieldShouldReturn,
  clickSelectButton,
  switchChange,
  selectAction
}

import { Addon } from "~/const"
import { CellViewType } from "~/typings/enum"
import { defineConfig } from "~/profile"
import { lang } from "./lang"

const { label, help, option } = lang
export default defineConfig({
  name: Addon.title,
  key: "addon",
  intro: `当前版本: ${Addon.version}`,
  link: "https://github.com/marginnoteapp/metadata",
  settings: [
    {
      key: "panelPosition",
      type: CellViewType.Select,
      option: option.panel_position,
      label: label.panel_position
    },
    {
      key: "panelHeight",
      type: CellViewType.Select,
      option: option.panel_height,
      label: label.panel_height
    },
    {
      key: "panelControl",
      type: CellViewType.Switch,
      label: label.panle_control
    },
    {
      key: "type",
      type: CellViewType.Select,
      option: [
        "期刊[J]",
        "专著[M]",
        "论文集[C]",
        "学位论文[D]",
        "专利[P]",
        "技术标准[S]",
        "报纸[N]",
        "科技报告[R]"
      ],
      label: label.type
    },
    {
      key: "isbn",
      type: CellViewType.InlineInput,
      label: "ISBN"
    },
    {
      key: "doi",
      type: CellViewType.InlineInput,
      label: "DOI"
    },
    {
      key: "author",
      type: CellViewType.InlineInput,
      label: label.author
    },
    {
      key: "publisher",
      type: CellViewType.InlineInput,
      label: label.publisher
    },
    {
      key: "publicationDate",
      type: CellViewType.InlineInput,
      label: label.publication_date
    },
    {
      key: "publicationPlace",
      type: CellViewType.InlineInput,
      label: label.publication_place
    },
    {
      key: "pageOffset",
      type: CellViewType.InlineInput,
      label: label.page_offset,
      check({ input }) {
        if (!/^[0-9\- ]*$/.test(input)) throw ""
      }
    },
    {
      key: "otherInfo",
      type: CellViewType.Input,
      help: label.other_info
    }
  ]
})

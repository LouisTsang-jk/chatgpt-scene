import { useContext, useEffect } from "react"
import styled from "styled-components"
import {
  Box,
  Checkbox,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography
} from "@mui/material"
import { DataContext, ListType, StorageKey } from "@/DataContext"
import useStorage from "@/hooks/useStorage"
import EmptyIcon from "@mui/icons-material/Inbox"
import HotPromptList from "@/conf/prompts_zh.json"

const TemplateDescriptionSpan = styled.span`
  color: #ccc;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
  overflow: hidden;
`

const TruncateSpan = styled.span`
  display: inline-block;
  width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`
export default function List() {
  const { templateList, setTemplateList } = useContext(DataContext)
  const { isBatchOperationActive } = useContext(DataContext)
  const { listType } = useContext(DataContext)

  const [templateStorage] = useStorage<Template[]>(StorageKey)

  useEffect(() => {
    if (listType === ListType.regular) {
      setTemplateList(templateStorage || [])
    }
    if (listType === ListType.hot) {
      setTemplateList((HotPromptList.map((prompt, promptIndex) => ({
        ...prompt,
        id: `${promptIndex}`
      })) as Template[]) || [])
    }
  }, [templateStorage, listType])

  const handleToggle = (template: Template) => {
    if (!isBatchOperationActive) return
    template.checked = !template.checked
    setTemplateList([...templateList])
  }

  return (
    <Box sx={{marginTop: '8px'}}>
      {templateList.map((template, templateIndex: number) => (
        <ListItemButton
          dense
          component="li"
          key={templateIndex}
          sx={{ padding: "0 8px" }}
          onClick={() => handleToggle(template)}
        >
          {isBatchOperationActive && (
            <ListItemIcon>
              <Checkbox
                size="small"
                checked={template.checked || false}
                inputProps={{ "aria-label": "controlled" }}
              />
            </ListItemIcon>
          )}
          <ListItemText
            primary={
              <TruncateSpan title={template.title}>
                {template.title}
              </TruncateSpan>
            }
            secondary={
              <>
                <TemplateDescriptionSpan title={template.body}>
                  {template.body}
                </TemplateDescriptionSpan>
              </>
            }
          />
        </ListItemButton>
      ))}
      {templateList.length === 0 && (
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          height="100%"
        >
          <EmptyIcon color="secondary" style={{ fontSize: 60 }} />
          <Typography color="secondary" variant="h6">Data is empty</Typography>
        </Box>
      )}
    </Box>
  )
}

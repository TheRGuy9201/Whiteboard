import { useState } from 'react';
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemButton,
  Collapse,
  Typography,
  Divider,
  IconButton,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  useTheme
} from '@mui/material';
import {
  BookOutlined,
  Add,
  FolderOutlined,
  DescriptionOutlined,
  ExpandLess,
  ExpandMore,
  Create,
  Delete,
  MenuBook
} from '@mui/icons-material';
import { ColorPalette } from '../../types';

interface NotebookSidebarProps {
  open: boolean;
  onClose: () => void;
  width?: number;
}

interface NotebookData {
  id: string;
  name: string;
  sections: SectionData[];
}

interface SectionData {
  id: string;
  name: string;
  pages: PageData[];
}

interface PageData {
  id: string;
  name: string;
}

// Sample data
const sampleNotebooks: NotebookData[] = [
  {
    id: 'notebook-1',
    name: 'Class 10 Algebra',
    sections: [
      {
        id: 'section-1-1',
        name: 'Quadratic Equations',
        pages: [
          { id: 'page-1-1-1', name: 'Introduction' },
          { id: 'page-1-1-2', name: 'Solving by Factoring' },
          { id: 'page-1-1-3', name: 'Completing the Square' }
        ]
      },
      {
        id: 'section-1-2',
        name: 'Linear Equations',
        pages: [
          { id: 'page-1-2-1', name: 'Systems of Equations' },
          { id: 'page-1-2-2', name: 'Graphing Lines' }
        ]
      }
    ]
  },
  {
    id: 'notebook-2',
    name: 'Class 11 Geometry',
    sections: [
      {
        id: 'section-2-1',
        name: 'Circles',
        pages: [
          { id: 'page-2-1-1', name: 'Properties' },
          { id: 'page-2-1-2', name: 'Tangents and Secants' }
        ]
      }
    ]
  }
];

const NotebookSidebar = ({ open, onClose, width = 280 }: NotebookSidebarProps) => {
  const theme = useTheme();
  const [notebooks, setNotebooks] = useState<NotebookData[]>(sampleNotebooks);
  const [expandedNotebooks, setExpandedNotebooks] = useState<Record<string, boolean>>({});
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});
  const [newNotebookDialogOpen, setNewNotebookDialogOpen] = useState(false);
  const [newSectionDialogOpen, setNewSectionDialogOpen] = useState(false);
  const [newPageDialogOpen, setNewPageDialogOpen] = useState(false);
  const [newItemName, setNewItemName] = useState('');
  const [selectedNotebook, setSelectedNotebook] = useState<string | null>(null);
  const [selectedSection, setSelectedSection] = useState<string | null>(null);
  const [selectedPage, setSelectedPage] = useState<string | null>(null);
  
  const colors = theme.palette.mode === 'dark' ? ColorPalette.dark : ColorPalette.light;

  const toggleNotebookExpand = (notebookId: string) => {
    setExpandedNotebooks({
      ...expandedNotebooks,
      [notebookId]: !expandedNotebooks[notebookId]
    });
  };

  const toggleSectionExpand = (sectionId: string) => {
    setExpandedSections({
      ...expandedSections,
      [sectionId]: !expandedSections[sectionId]
    });
  };

  const handleCreateNotebook = () => {
    if (!newItemName.trim()) return;
    
    const newNotebook: NotebookData = {
      id: `notebook-${Date.now()}`,
      name: newItemName,
      sections: []
    };
    
    setNotebooks([...notebooks, newNotebook]);
    setNewNotebookDialogOpen(false);
    setNewItemName('');
  };

  const handleCreateSection = () => {
    if (!newItemName.trim() || !selectedNotebook) return;
    
    const newSection: SectionData = {
      id: `section-${Date.now()}`,
      name: newItemName,
      pages: []
    };
    
    const updatedNotebooks = notebooks.map(notebook => {
      if (notebook.id === selectedNotebook) {
        return {
          ...notebook,
          sections: [...notebook.sections, newSection]
        };
      }
      return notebook;
    });
    
    setNotebooks(updatedNotebooks);
    setNewSectionDialogOpen(false);
    setNewItemName('');
    
    // Expand the notebook to show the new section
    setExpandedNotebooks({
      ...expandedNotebooks,
      [selectedNotebook]: true
    });
  };

  const handleCreatePage = () => {
    if (!newItemName.trim() || !selectedNotebook || !selectedSection) return;
    
    const newPage: PageData = {
      id: `page-${Date.now()}`,
      name: newItemName
    };
    
    const updatedNotebooks = notebooks.map(notebook => {
      if (notebook.id === selectedNotebook) {
        return {
          ...notebook,
          sections: notebook.sections.map(section => {
            if (section.id === selectedSection) {
              return {
                ...section,
                pages: [...section.pages, newPage]
              };
            }
            return section;
          })
        };
      }
      return notebook;
    });
    
    setNotebooks(updatedNotebooks);
    setNewPageDialogOpen(false);
    setNewItemName('');
    
    // Expand the notebook and section to show the new page
    setExpandedNotebooks({
      ...expandedNotebooks,
      [selectedNotebook]: true
    });
    setExpandedSections({
      ...expandedSections,
      [selectedSection]: true
    });
  };

  const handlePageSelect = (notebookId: string, sectionId: string, pageId: string) => {
    setSelectedNotebook(notebookId);
    setSelectedSection(sectionId);
    setSelectedPage(pageId);
    
    // In a real implementation, this would load the selected page
    console.log(`Selected page: ${pageId} in section ${sectionId} of notebook ${notebookId}`);
    
    // Close the sidebar on mobile
    if (window.innerWidth < 960) {
      onClose();
    }
  };

  return (
    <Drawer
      variant="persistent"
      anchor="left"
      open={open}
      sx={{
        width,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width,
          boxSizing: 'border-box',
          borderRight: `1px solid ${colors.border}`,
        },
      }}
    >
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        p: 2, 
        borderBottom: `1px solid ${colors.border}`
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <MenuBook sx={{ mr: 1, color: colors.secondary }} />
          <Typography variant="h6" component="div">
            Notebooks
          </Typography>
        </Box>
        <IconButton onClick={() => setNewNotebookDialogOpen(true)}>
          <Add />
        </IconButton>
      </Box>

      <List sx={{ overflow: 'auto', flexGrow: 1 }}>
        {notebooks.map(notebook => (
          <Box key={notebook.id}>
            <ListItemButton 
              onClick={() => toggleNotebookExpand(notebook.id)}
              selected={selectedNotebook === notebook.id && !selectedSection}
              sx={{
                backgroundColor: selectedNotebook === notebook.id && !selectedSection 
                  ? `${colors.primary}20` 
                  : 'transparent',
                '&:hover': {
                  backgroundColor: `${colors.primary}10`,
                }
              }}
            >
              <ListItemIcon>
                <BookOutlined color="primary" />
              </ListItemIcon>
              <ListItemText primary={notebook.name} />
              {expandedNotebooks[notebook.id] ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>
            
            <Collapse in={expandedNotebooks[notebook.id] || false} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                <ListItemButton 
                  sx={{ pl: 4 }}
                  onClick={() => {
                    setSelectedNotebook(notebook.id);
                    setNewSectionDialogOpen(true);
                  }}
                >
                  <ListItemIcon>
                    <Add fontSize="small" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Add Section" 
                    primaryTypographyProps={{ variant: 'body2', color: 'text.secondary' }}
                  />
                </ListItemButton>
                
                {notebook.sections.map(section => (
                  <Box key={section.id}>
                    <ListItemButton 
                      sx={{ pl: 4 }}
                      onClick={() => toggleSectionExpand(section.id)}
                      selected={selectedSection === section.id && !selectedPage}
                    >
                      <ListItemIcon>
                        <FolderOutlined color="secondary" />
                      </ListItemIcon>
                      <ListItemText primary={section.name} />
                      {expandedSections[section.id] ? <ExpandLess /> : <ExpandMore />}
                    </ListItemButton>
                    
                    <Collapse in={expandedSections[section.id] || false} timeout="auto" unmountOnExit>
                      <List component="div" disablePadding>
                        <ListItemButton 
                          sx={{ pl: 6 }}
                          onClick={() => {
                            setSelectedNotebook(notebook.id);
                            setSelectedSection(section.id);
                            setNewPageDialogOpen(true);
                          }}
                        >
                          <ListItemIcon>
                            <Add fontSize="small" />
                          </ListItemIcon>
                          <ListItemText 
                            primary="Add Page" 
                            primaryTypographyProps={{ variant: 'body2', color: 'text.secondary' }}
                          />
                        </ListItemButton>
                        
                        {section.pages.map(page => (
                          <ListItemButton 
                            key={page.id}
                            sx={{ pl: 6 }}
                            selected={selectedPage === page.id}
                            onClick={() => handlePageSelect(notebook.id, section.id, page.id)}
                          >
                            <ListItemIcon>
                              <DescriptionOutlined />
                            </ListItemIcon>
                            <ListItemText primary={page.name} />
                          </ListItemButton>
                        ))}
                      </List>
                    </Collapse>
                  </Box>
                ))}
              </List>
            </Collapse>
          </Box>
        ))}
      </List>

      {/* Dialog for creating a new notebook */}
      <Dialog open={newNotebookDialogOpen} onClose={() => setNewNotebookDialogOpen(false)}>
        <DialogTitle>Create New Notebook</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Notebook Name"
            fullWidth
            variant="outlined"
            value={newItemName}
            onChange={(e) => setNewItemName(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setNewNotebookDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleCreateNotebook} color="primary">Create</Button>
        </DialogActions>
      </Dialog>

      {/* Dialog for creating a new section */}
      <Dialog open={newSectionDialogOpen} onClose={() => setNewSectionDialogOpen(false)}>
        <DialogTitle>Create New Section</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Section Name"
            fullWidth
            variant="outlined"
            value={newItemName}
            onChange={(e) => setNewItemName(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setNewSectionDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleCreateSection} color="primary">Create</Button>
        </DialogActions>
      </Dialog>

      {/* Dialog for creating a new page */}
      <Dialog open={newPageDialogOpen} onClose={() => setNewPageDialogOpen(false)}>
        <DialogTitle>Create New Page</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Page Name"
            fullWidth
            variant="outlined"
            value={newItemName}
            onChange={(e) => setNewItemName(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setNewPageDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleCreatePage} color="primary">Create</Button>
        </DialogActions>
      </Dialog>
    </Drawer>
  );
};

export default NotebookSidebar;

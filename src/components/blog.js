import { useState, useEffect } from "react";
import axios from "axios";
import { Box, Flex, Badge, Text, ChakraProvider, TabList, Tab, TabPanels, TabPanel, Tabs, useToast, FormControl, Table, FormLabel, Input, Button, Wrap, WrapItem, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, Textarea, Stack, Heading, ModalFooter, IconButton, HStack } from "@chakra-ui/react";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  EditIcon,
  DeleteIcon,
  ViewIcon,
} from "@chakra-ui/icons";



const PAGE_SIZE = 25;

const PostsPage = () => {
  const [posts, setPosts] = useState([]);
  const [filteredPosts,setFilteredPosts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editBody, setEditBody] = useState("");
  const toast = useToast();

  useEffect(() => {
    const fetchPosts = async () => {
      const response = await axios.get(
        `https://jsonplaceholder.typicode.com/posts?_page=${currentPage}&_limit=${PAGE_SIZE}`
      );
      setPosts(response.data);
      setFilteredPosts(response.data);
      setTotalPages(Math.ceil(response.headers["x-total-count"] / PAGE_SIZE));
    };
    fetchPosts();
  }, [currentPage]);

  useEffect(()=>{
    let filter=posts.filter((item)=>{
        return item.title,item.title.includes(searchTerm)
    })
    setFilteredPosts(filter);
  },[searchTerm])

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleSearchTermChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleEditModalClose = () => {
    setShowEditModal(false);
  };

  const handleEditModalShow = (post) => {
    setSelectedPost(post);
    setEditTitle(post.title);
    setEditBody(post.body);
    setShowEditModal(true);
  };

  const handleEditTitleChange = (event) => {
    setEditTitle(event.target.value);
  };

  const handleEditBodyChange = (event) => {
    setEditBody(event.target.value);
  };

  const handleSaveChangesClick = async () => {
    const response = await axios.put(
      `https://jsonplaceholder.typicode.com/posts/${selectedPost.id}`,
      {
        ...selectedPost,
        title: editTitle,
        body: editBody,
      }
    );
    setFilteredPosts((prevPosts) =>
      prevPosts.map((post) =>
        post.id === response.data.id ? response.data : post
      )
    );

    handleEditModalClose();
    toast({
      title: "Post updated.",
      description: `The post "${response.data.title}" has been updated.`,
      status: "success",
      duration: 5000,
      isClosable: true,
    });
  };

  const handleDeleteClick = async (post) => {
    await axios.delete(`https://jsonplaceholder.typicode.com/posts/${post.id}`);
    setFilteredPosts((prevPosts) =>
      prevPosts.filter((prevPost) => prevPost.id !== post.id)
    );
    toast({
      title: "Post deleted.",
      description: `The post "${post.title}" has been deleted.`,
      status: "success",
      duration: 5000,
      isClosable: true,
    });
  };

  return (
    <Box p={4}>
      <FormControl>
        <FormLabel htmlFor="searchTerm">Search Posts:</FormLabel>
        <Input
          id="searchTerm"
          placeholder="Enter a keyword..."
          value={searchTerm}
          onChange={handleSearchTermChange}
        />
      </FormControl>
      <Table variant="simple" mt={4}>
        <thead>
          <tr>
            <th>Title</th>
            <th>Author</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredPosts.map((post) => (
            <tr key={post.id}>
              <td>{post.title}</td>
              <td>{post.userId}</td>
              <td>
                <HStack spacing={2}>
                  <IconButton
                    size="sm"
                    variant="ghost"
                    aria-label="Edit Post"
                    icon={<EditIcon />}
                    onClick={() => handleEditModalShow(post)}
                  />
                  <IconButton
                    size="sm"
                    variant="ghost"
                    aria-label="Delete Post"
                    icon={<DeleteIcon />}
                    onClick={() => handleDeleteClick(post)}
                  />
                </HStack>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      <Flex mt={4} justifyContent="space-between" alignItems="center">
        <Button
          leftIcon={<ChevronLeftIcon />}
          variant="solid"
          size="sm"
          isDisabled={currentPage === 1}
          onClick={() => handlePageChange(currentPage - 1)}
        >
          Previous Page
        </Button>
        <Wrap spacing={2}>
          {Array.from({ length: totalPages }).map((_, index) => (
            <WrapItem key={index}>
              <Badge
                size="md"
                variant="solid"
                colorScheme={currentPage === index + 1 ? "teal" : "gray"}
                onClick={() => handlePageChange(index + 1)}
                _hover={{
                  cursor: "pointer",
                }}
              >
                {index + 1}
              </Badge>
            </WrapItem>
          ))}
        </Wrap>
        <Button
          rightIcon={<ChevronRightIcon />}
          variant="solid"
          size="sm"
          isDisabled={currentPage === totalPages}
          onClick={() => handlePageChange(currentPage + 1)}
        >
          Next Page
        </Button>
      </Flex>
      <Modal isOpen={showEditModal} onClose={handleEditModalClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Edit Post</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl>
              <FormLabel htmlFor="editTitle">Title:</FormLabel>
              <Input
                id="editTitle"
                placeholder="Enter the title of the post..."
                value={editTitle}
                onChange={handleEditTitleChange}
              />
            </FormControl>
            <FormControl mt={4}>
              <FormLabel htmlFor="editBody">Body:</FormLabel>
              <Textarea
                id="editBody"
                placeholder="Enter the body of the post..."
                value={editBody}
                onChange={handleEditBodyChange}
              />
            </FormControl>
          </ModalBody>
          <Flex p={4} justifyContent="flex-end">
            <Button variant="ghost" onClick={handleEditModalClose}>
              Cancel
            </Button>
            <Button colorScheme="blue" ml={2} onClick={handleSaveChangesClick}>
              Save Changes
            </Button>
          </Flex>
        </ModalContent>
      </Modal>
    </Box>
  );
};
const UserDetailsModal = ({ user, isOpen, onClose }) => (
  <Modal isOpen={isOpen} onClose={onClose}>
    <ModalOverlay />
    <ModalContent>
      <ModalHeader>{user?.name}</ModalHeader>
      <ModalCloseButton />
      <ModalBody>
        <Stack spacing={4}>
          <Box>
            <Heading size="sm">Username</Heading>
            <Text>{user?.username}</Text>
          </Box>
          <Box>
            <Heading size="sm">Email</Heading>
            <Text>{user?.email}</Text>
          </Box>
          <Box>
            <Heading size="sm">Address</Heading>
            <Text>{`${user?.address.street}, ${user?.address.suite}, ${user?.address.city}, ${user?.address.zipcode}`}</Text>
          </Box>
        </Stack>
      </ModalBody>
      <ModalFooter>
        <Button variant="ghost" onClick={onClose}>
          Close
        </Button>
      </ModalFooter>
    </ModalContent>
  </Modal>
);

const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showUserDetailsModal, setShowUserDetailsModal] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      const response = await fetch(
        "https://jsonplaceholder.typicode.com/users"
      );
      const data = await response.json();
      setUsers(data);
    };
    fetchUsers();
  }, []);

  const handleUserClick = (user) => {
    setSelectedUser(user);
    setShowUserDetailsModal(true);
  };

  const handleUserDetailsModalClose = () => {
    setShowUserDetailsModal(false);
  };

  return (
    <Box p={4}>
      <Table variant="simple" mt={4}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>
                <IconButton
                  size="sm"
                  variant="ghost"
                  aria-label="View User Details"
                  icon={<ViewIcon />}
                  onClick={() => handleUserClick(user)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      <UserDetailsModal
        user={selectedUser}
        isOpen={showUserDetailsModal}
        onClose={handleUserDetailsModalClose}
      />
    </Box>
  );
};

export default function Blog() {
  return (
    <ChakraProvider>
        <Box maxW="1200px" mx="auto" py={8} px={4}>
          <Heading as="h1" size="xl" mb={4}>
            Blog Posts Manager
          </Heading>
          <Tabs variant="enclosed">
            <TabList mb={4}>
              <Tab>Posts</Tab>
              <Tab>Users</Tab>
            </TabList>
            <TabPanels>
              <TabPanel>
                <PostsPage />
              </TabPanel>
              <TabPanel>
                <UsersPage />
              </TabPanel>
            </TabPanels>
          </Tabs>
        </Box>
    </ChakraProvider>
    
  );
};

import {
  Avatar,
  Box,
  Button,
  IconButton,
  Typography,
} from "@mui/material";
import React, {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import {
  IoMdSend,
  IoMdTrash,
  IoMdMenu,
  IoMdClose,
} from "react-icons/io";
import {
  MdAutoAwesome,
  MdKeyboardArrowDown,
} from "react-icons/md";
import { useAuth } from "../context/AuthContext";
import ChatItem from "../components/chat/ChatItem";
import {
  deleteChats,
  getChats,
  sendChatReq,
} from "../helpers/api-communicator";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

type Message = {
  role: "user" | "assistant";
  content: string;
};

const Chat = () => {
  const navigate = useNavigate();
  const auth = useAuth();

  const inputRef = useRef<HTMLTextAreaElement | null>(null);
  const messagesContainerRef = useRef<HTMLDivElement | null>(null);

  const [chatMessages, setChatMessages] = useState<Message[]>([]);
  const [isSending, setIsSending] = useState(false);
  const [mobileSidebar, setMobileSidebar] = useState(false);
  const [showScrollButton, setShowScrollButton] = useState(false);

  const scrollToBottom = (smooth = true) => {
    const container = messagesContainerRef.current;

    if (!container) return;

    container.scrollTo({
      top: container.scrollHeight,
      behavior: smooth ? "smooth" : "auto",
    });
  };

  const handleScroll = () => {
    const container = messagesContainerRef.current;

    if (!container) return;

    const distanceFromBottom =
      container.scrollHeight -
      container.scrollTop -
      container.clientHeight;

    setShowScrollButton(distanceFromBottom > 250);
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();

    const content = inputRef.current?.value.trim();

    if (!content || isSending) {
      return;
    }

    if (inputRef.current) {
      inputRef.current.value = "";
      inputRef.current.style.height = "auto";
    }

    const newMessage: Message = {
      role: "user",
      content,
    };

    setChatMessages((prev) => [...prev, newMessage]);
    setIsSending(true);

    setTimeout(() => scrollToBottom(), 50);

    try {
      const chatData = await sendChatReq(content);

      setChatMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            chatData?.chatResponse ||
            "Sorry, I couldn't generate a response.",
        },
      ]);
    } catch (error) {
      console.error(error);

      toast.error("Failed to get response");

      setChatMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "Sorry, something went wrong while generating the response.",
        },
      ]);
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLTextAreaElement>
  ) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleInput = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    e.target.style.height = "auto";
    e.target.style.height =
      Math.min(e.target.scrollHeight, 180) + "px";
  };

  const handleDelete = async () => {
    try {
      toast.loading("Clearing conversation...", {
        id: "deleteChats",
      });

      await deleteChats();

      setChatMessages([]);

      toast.success("Conversation cleared", {
        id: "deleteChats",
      });
    } catch (error) {
      console.error(error);

      toast.error("Failed to clear conversation", {
        id: "deleteChats",
      });
    }
  };

  useEffect(() => {
    if (!auth?.user) {
      navigate("/login");
    }
  }, [auth, navigate]);

  useLayoutEffect(() => {
    if (auth?.isLoggedIn && auth.user) {
      toast.loading("Loading conversation...", {
        id: "loadChats",
      });

      getChats()
        .then((data) => {
          setChatMessages(data?.chats || []);

          toast.success("Conversation loaded", {
            id: "loadChats",
          });

          setTimeout(() => {
            scrollToBottom(false);
          }, 100);
        })
        .catch((error) => {
          console.error(error);

          toast.error("Failed to load chats", {
            id: "loadChats",
          });
        });
    }
  }, [auth]);

  useEffect(() => {
    const timer = setTimeout(() => {
      scrollToBottom();
    }, 50);

    return () => clearTimeout(timer);
  }, [chatMessages]);

  return (
    <Box
      sx={{
        height: "calc(100vh - 80px)",
        display: "flex",
        position: "relative",
        overflow: "hidden",
        bgcolor: "#0b0f0e",
        color: "#fff",
      }}
    >
      {/* MOBILE OVERLAY */}
      {mobileSidebar && (
        <Box
          onClick={() => setMobileSidebar(false)}
          sx={{
            display: { xs: "block", md: "none" },
            position: "fixed",
            inset: 0,
            bgcolor: "rgba(0,0,0,0.65)",
            zIndex: 1200,
          }}
        />
      )}

      {/* SIDEBAR */}
      <Box
        sx={{
          width: 280,
          flexShrink: 0,
          bgcolor: "#111816",
          borderRight: "1px solid #26302d",
          display: "flex",
          flexDirection: "column",
          p: 2,
          position: {
            xs: "fixed",
            md: "relative",
          },
          left: {
            xs: mobileSidebar ? 0 : "-300px",
            md: 0,
          },
          top: {
            xs: 0,
            md: "auto",
          },
          bottom: {
            xs: 0,
            md: "auto",
          },
          zIndex: 1300,
          transition: "left 0.25s ease",
        }}
      >
        {/* SIDEBAR HEADER */}

        {/* USER */}
        <Box
          sx={{
            p: 2,
            borderRadius: 3,
            bgcolor: "#17201d",
            border: "1px solid #27332f",
            mb: 2,
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1.5,
            }}
          >
            <Avatar
              sx={{
                bgcolor: "#20d7c7",
                color: "#07100e",
                fontWeight: 700,
              }}
            >
              {auth?.user?.name?.[0]}
              {auth?.user?.name?.split(" ")[1]?.[0]}
            </Avatar>

            <Box sx={{ minWidth: 0 }}>
              <Typography
                sx={{
                  fontSize: 15,
                  fontWeight: 600,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {auth?.user?.name}
              </Typography>

              <Typography
                sx={{
                  fontSize: 12,
                  color: "#7f8b87",
                }}
              >
                Gemini AI
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* INFO */}
        <Box
          sx={{
            p: 2,
            borderRadius: 3,
            bgcolor: "#0d1311",
            border: "1px solid #202925",
          }}
        >
          <Box
            sx={{
              display: "flex",
              gap: 1,
              alignItems: "center",
              mb: 1,
            }}
          >
            <MdAutoAwesome color="#20d7c7" />

            <Typography
              sx={{
                fontSize: 14,
                fontWeight: 600,
              }}
            >
              AI Assistant
            </Typography>
          </Box>

          <Typography
            sx={{
              fontSize: 13,
              lineHeight: 1.6,
              color: "#89948f",
            }}
          >
            Ask questions, explain concepts, write code,
            solve problems, plan projects and more.
          </Typography>
        </Box>

        {/* SPACER */}
        <Box sx={{ flex: 1 }} />

        {/* CLEAR */}
        <Button
          startIcon={<IoMdTrash />}
          onClick={handleDelete}
          sx={{
            width: "100%",
            py: 1.2,
            borderRadius: 2.5,
            color: "#ff7b7b",
            border: "1px solid #4b2727",
            textTransform: "none",
            fontWeight: 600,
            "&:hover": {
              bgcolor: "#301818",
              borderColor: "#693333",
            },
          }}
        >
          Clear conversation
        </Button>
      </Box>

      {/* MAIN */}
      <Box
        sx={{
          flex: 1,
          minWidth: 0,
          minHeight: 0,
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* TOP BAR */}
        <Box
          sx={{
            height: 64,
            flexShrink: 0,
            display: "flex",
            alignItems: "center",
            px: {
              xs: 2,
              md: 4,
            },
            borderBottom: "1px solid #1e2724",
            bgcolor: "#0d1210",
          }}
        >
          <IconButton
            onClick={() => setMobileSidebar(true)}
            sx={{
              display: { xs: "flex", md: "none" },
              color: "#fff",
              mr: 1,
            }}
          >
            <IoMdMenu />
          </IconButton>

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1.5,
            }}
          >
            <Box
              sx={{
                width: 9,
                height: 9,
                borderRadius: "50%",
                bgcolor: "#20d7c7",
                boxShadow: "0 0 12px #20d7c7",
              }}
            />

            <Typography
              sx={{
                fontSize: 15,
                fontWeight: 600,
              }}
            >
              Gemini 3.6 Flash
            </Typography>
          </Box>

          <Typography
            sx={{
              ml: 2,
              color: "#68736f",
              fontSize: 13,
              display: {
                xs: "none",
                sm: "block",
              },
            }}
          >
            AI Assistant
          </Typography>
        </Box>

        {/* MESSAGE AREA */}
        <Box
          ref={messagesContainerRef}
          onScroll={handleScroll}
          sx={{
            flex: 1,
            minHeight: 0,
            overflowY: "auto",
            overflowX: "hidden",
            px: {
              xs: 1,
              sm: 3,
              md: 5,
            },
            py: 3,

            "&::-webkit-scrollbar": {
              width: 7,
            },

            "&::-webkit-scrollbar-thumb": {
              bgcolor: "#303a36",
              borderRadius: 10,
            },

            "&::-webkit-scrollbar-track": {
              bgcolor: "transparent",
            },
          }}
        >
          {chatMessages.length === 0 ? (
            <Box
              sx={{
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                px: 2,
              }}
            >
              <Box
                sx={{
                  textAlign: "center",
                  maxWidth: 650,
                }}
              >
                <Box
                  sx={{
                    width: 70,
                    height: 70,
                    mx: "auto",
                    mb: 3,
                    borderRadius: 4,
                    bgcolor: "#172522",
                    border: "1px solid #29423c",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: "0 0 40px rgba(32,215,199,0.08)",
                  }}
                >
                  <MdAutoAwesome
                    size={34}
                    color="#20d7c7"
                  />
                </Box>

                <Typography
                  sx={{
                    fontSize: {
                      xs: 26,
                      md: 34,
                    },
                    fontWeight: 700,
                    mb: 1,
                  }}
                >
                  How can I help you?
                </Typography>

                <Typography
                  sx={{
                    color: "#78847f",
                    fontSize: 15,
                    lineHeight: 1.7,
                  }}
                >
                  Ask me anything. I can help with programming,
                  learning, problem solving, planning and more.
                </Typography>

                <Box
                  sx={{
                    display: "flex",
                    flexWrap: "wrap",
                    justifyContent: "center",
                    gap: 1,
                    mt: 4,
                  }}
                >
                  {[
                    "Explain binary search",
                    "Help me debug my code",
                    "Create a study plan",
                    "Explain machine learning",
                  ].map((text) => (
                    <Button
                      key={text}
                      onClick={() => {
                        if (inputRef.current) {
                          inputRef.current.value = text;
                          inputRef.current.focus();
                        }
                      }}
                      sx={{
                        color: "#aeb8b4",
                        bgcolor: "#141c19",
                        border: "1px solid #27322f",
                        borderRadius: 3,
                        px: 2,
                        py: 1,
                        textTransform: "none",
                        fontSize: 13,
                        "&:hover": {
                          bgcolor: "#1b2824",
                          borderColor: "#38524b",
                        },
                      }}
                    >
                      {text}
                    </Button>
                  ))}
                </Box>
              </Box>
            </Box>
          ) : (
            <Box
              sx={{
                maxWidth: 950,
                width: "100%",
                mx: "auto",
              }}
            >
              {chatMessages.map((chat, index) => (
                <ChatItem
                  key={index}
                  content={chat.content}
                  role={chat.role}
                />
              ))}

              {isSending && (
                <Box
                  sx={{
                    display: "flex",
                    gap: 2,
                    alignItems: "flex-start",
                    py: 2,
                  }}
                >
                  <Avatar
                    sx={{
                      width: 34,
                      height: 34,
                      bgcolor: "#fff",
                    }}
                  >
                    <img
                      src="/openai.png"
                      alt="AI"
                      width="24"
                      height="24"
                    />
                  </Avatar>

                  <Box
                    sx={{
                      display: "flex",
                      gap: 0.6,
                      alignItems: "center",
                      pt: 1,
                    }}
                  >
                    {[0, 1, 2].map((item) => (
                      <Box
                        key={item}
                        sx={{
                          width: 7,
                          height: 7,
                          bgcolor: "#6d7975",
                          borderRadius: "50%",
                          animation:
                            "typing 1.2s infinite",
                          animationDelay: `${item * 0.15}s`,
                          "@keyframes typing": {
                            "0%, 60%, 100%": {
                              transform: "translateY(0)",
                              opacity: 0.4,
                            },
                            "30%": {
                              transform: "translateY(-5px)",
                              opacity: 1,
                            },
                          },
                        }}
                      />
                    ))}
                  </Box>
                </Box>
              )}
            </Box>
          )}
        </Box>

        {/* SCROLL TO BOTTOM */}
        {showScrollButton && (
          <IconButton
            onClick={() => scrollToBottom()}
            sx={{
              position: "absolute",
              bottom: 105,
              right: 35,
              bgcolor: "#17201d",
              border: "1px solid #35423e",
              color: "#fff",
              width: 38,
              height: 38,
              "&:hover": {
                bgcolor: "#24312d",
              },
            }}
          >
            <MdKeyboardArrowDown />
          </IconButton>
        )}

        {/* COMPOSER */}
        <Box
          sx={{
            flexShrink: 0,
            px: {
              xs: 1.5,
              sm: 3,
              md: 5,
            },
            pb: {
              xs: 1.5,
              md: 2.5,
            },
            pt: 1,
            bgcolor: "#0b0f0e",
          }}
        >
          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{
              maxWidth: 950,
              mx: "auto",
              display: "flex",
              alignItems: "flex-end",
              gap: 1,
              bgcolor: "#151d1a",
              border: "1px solid #2b3733",
              borderRadius: 4,
              px: 1.5,
              py: 1.2,
              transition: "border-color 0.2s",
              "&:focus-within": {
                borderColor: "#3d665c",
              },
            }}
          >
            <textarea
              ref={inputRef}
              rows={1}
              disabled={isSending}
              onKeyDown={handleKeyDown}
              onChange={handleInput}
              placeholder="Message Gemini..."
              style={{
                flex: 1,
                resize: "none",
                maxHeight: "180px",
                overflowY: "auto",
                background: "transparent",
                border: "none",
                outline: "none",
                color: "#fff",
                fontFamily: "inherit",
                fontSize: "16px",
                lineHeight: "24px",
                padding: "8px 6px",
              }}
            />

            <IconButton
              type="submit"
              disabled={isSending}
              sx={{
                width: 42,
                height: 42,
                flexShrink: 0,
                bgcolor: "#20d7c7",
                color: "#07100e",
                "&:hover": {
                  bgcolor: "#39e6d7",
                },
                "&.Mui-disabled": {
                  bgcolor: "#29332f",
                  color: "#59635f",
                },
              }}
            >
              <IoMdSend size={20} />
            </IconButton>
          </Box>

          <Typography
            sx={{
              textAlign: "center",
              color: "#59635f",
              fontSize: 11,
              mt: 1,
            }}
          >
            Enter to send • Shift + Enter for a new line
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default Chat;
import { Avatar, Box, IconButton, Tooltip } from "@mui/material";
import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";

import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { coldarkCold } from "react-syntax-highlighter/dist/esm/styles/prism";

import {
  MdContentCopy,
  MdCheck,
} from "react-icons/md";

type ChatItemProps = {
  content: string;
  role: "user" | "assistant";
};

const ChatItem = ({
  content,
  role,
}: ChatItemProps) => {
  const auth = useAuth();
  const [copied, setCopied] = useState(false);

  const copyMessage = async () => {
    try {
      await navigator.clipboard.writeText(content);

      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 1500);
    } catch (error) {
      console.error(error);
    }
  };

  const isAssistant = role === "assistant";

  return (
    <Box
      sx={{
        display: "flex",
        gap: 2,
        py: 2.5,
        px: {
          xs: 0.5,
          sm: 1,
        },
        borderBottom: "1px solid rgba(255,255,255,0.035)",
      }}
    >
      {/* AVATAR */}
      <Avatar
        sx={{
          width: 34,
          height: 34,
          flexShrink: 0,
          bgcolor: isAssistant
            ? "#fff"
            : "#20d7c7",
          color: isAssistant
            ? "#111"
            : "#07100e",
          fontSize: 12,
          fontWeight: 700,
        }}
      >
        {isAssistant ? (
          <img
            src="/openai.png"
            alt="AI"
            width="24"
            height="24"
          />
        ) : (
          <>
            {auth?.user?.name?.[0]}
            {auth?.user?.name?.split(" ")[1]?.[0]}
          </>
        )}
      </Avatar>

      {/* CONTENT */}
      <Box
        sx={{
          flex: 1,
          minWidth: 0,
          color: "#e8ecea",

          "& p": {
            margin: "0 0 16px",
            fontSize: "15.5px",
            lineHeight: 1.75,
          },

          "& p:last-child": {
            marginBottom: 0,
          },

          "& h1": {
            fontSize: "27px",
            lineHeight: 1.3,
            margin: "20px 0 12px",
            color: "#fff",
          },

          "& h2": {
            fontSize: "23px",
            lineHeight: 1.35,
            margin: "20px 0 10px",
            color: "#fff",
          },

          "& h3": {
            fontSize: "19px",
            lineHeight: 1.4,
            margin: "18px 0 8px",
            color: "#fff",
          },

          "& strong": {
            color: "#fff",
            fontWeight: 700,
          },

          "& em": {
            color: "#d7dfdc",
          },

          "& ul, & ol": {
            margin: "10px 0 16px",
            paddingLeft: "26px",
          },

          "& li": {
            marginBottom: "7px",
            lineHeight: 1.65,
            fontSize: "15.5px",
          },

          "& li > p": {
            marginBottom: "4px",
          },

          "& blockquote": {
            margin: "16px 0",
            padding: "10px 16px",
            borderLeft: "3px solid #20d7c7",
            bgcolor: "#111a17",
            color: "#aab5b1",
          },

          "& a": {
            color: "#35d9cc",
            textDecoration: "none",
          },

          "& a:hover": {
            textDecoration: "underline",
          },

          "& code:not(pre code)": {
            bgcolor: "#202a26",
            color: "#e8eeeb",
            border: "1px solid #303b36",
            borderRadius: "5px",
            padding: "2px 6px",
            fontFamily:
              '"SFMono-Regular", Consolas, monospace',
            fontSize: "0.88em",
          },

          "& pre": {
            margin: "16px 0",
            borderRadius: "9px",
            overflow: "hidden",
            maxWidth: "100%",
            border: "1px solid #303b37",
          },

          "& table": {
            width: "100%",
            borderCollapse: "collapse",
            margin: "18px 0",
            display: "block",
            overflowX: "auto",
          },

          "& th, & td": {
            border: "1px solid #39443f",
            padding: "9px 12px",
            textAlign: "left",
            whiteSpace: "nowrap",
          },

          "& th": {
            backgroundColor: "#1a2420",
            color: "#fff",
            fontWeight: 700,
          },

          "& hr": {
            border: 0,
            borderTop: "1px solid #303936",
            margin: "22px 0",
          },

          "& img": {
            maxWidth: "100%",
            borderRadius: 8,
          },
        }}
      >
        <ReactMarkdown
          remarkPlugins={[
            remarkGfm,
            remarkMath,
          ]}
          rehypePlugins={[
            rehypeKatex,
          ]}
          components={{
            code({
              className,
              children,
              ...props
            }) {
              const match =
                /language-(\w+)/.exec(
                  className || ""
                );

              const code = String(children).replace(
                /\n$/,
                ""
              );

              if (!match) {
                return (
                  <code
                    className={className}
                    {...props}
                  >
                    {children}
                  </code>
                );
              }

              return (
                <Box
                  sx={{
                    position: "relative",
                    width: "100%",
                  }}
                >
                  <Box
                    sx={{
                      position: "absolute",
                      top: 8,
                      right: 8,
                      zIndex: 2,
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      px: 1,
                      py: 0.5,
                      borderRadius: 1,
                      bgcolor: "#1b2421",
                      color: "#aab4b0",
                      fontSize: 11,
                    }}
                  >
                    {match[1]}

                    <Tooltip
                      title={
                        copied
                          ? "Copied"
                          : "Copy code"
                      }
                    >
                      <IconButton
                        size="small"
                        onClick={() => {
                          navigator.clipboard
                            .writeText(code)
                            .then(() => {
                              setCopied(true);

                              setTimeout(() => {
                                setCopied(false);
                              }, 1500);
                            });
                        }}
                        sx={{
                          color: "#b4bfbb",
                          p: 0.3,
                        }}
                      >
                        {copied ? (
                          <MdCheck size={15} />
                        ) : (
                          <MdContentCopy size={15} />
                        )}
                      </IconButton>
                    </Tooltip>
                  </Box>

                  <SyntaxHighlighter
                    style={coldarkCold}
                    language={match[1]}
                    PreTag="div"
                    customStyle={{
                      margin: 0,
                      padding: "18px",
                      paddingTop: "45px",
                      background: "#101614",
                      fontSize: "14px",
                      lineHeight: 1.6,
                    }}
                  >
                    {code}
                  </SyntaxHighlighter>
                </Box>
              );
            },

            a({ href, children }) {
              return (
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {children}
                </a>
              );
            },
          }}
        >
          {content}
        </ReactMarkdown>

        {/* MESSAGE COPY */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            mt: 1,
            opacity: 0,
            transition: "opacity 0.2s",
            ".MuiBox-root:hover > &": {
              opacity: 1,
            },
          }}
        >
          <Tooltip
            title={
              copied
                ? "Copied"
                : "Copy response"
            }
          >
            <IconButton
              size="small"
              onClick={copyMessage}
              sx={{
                color: "#65716d",
                "&:hover": {
                  color: "#fff",
                },
              }}
            >
              {copied ? (
                <MdCheck size={16} />
              ) : (
                <MdContentCopy size={16} />
              )}
            </IconButton>
          </Tooltip>
        </Box>
      </Box>
    </Box>
  );
};

export default ChatItem;
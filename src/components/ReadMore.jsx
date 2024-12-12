import { useState } from "react";
import styled from "styled-components";
import DOMPurify from "dompurify"; // For sanitizing HTML

// Styled components
const Container = styled.div`
    font-family: Arial, sans-serif;
    line-height: 1.6;

    h1,
    h2,
    h3 {
        margin: 0.8rem 0 0.2rem 0;
    }

    p {
        margin: 0;
    }
`;

const ToggleButton = styled.button`
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 0.25rem;
    padding: 0.25rem 0.6rem;
    cursor: pointer;
    font-size: 14px;
    transition: background-color 0.3s ease;
    margin-top: 0.5rem;

    &:hover {
        background-color: #0056b3;
    }

    &:focus {
        outline: none;
    }
`;

const truncatePTagContent = (html, maxLength) => {
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = html;

    let totalLength = 0;
    let resultHtml = "";

    for (let node of tempDiv.childNodes) {
        if (node.nodeType === Node.ELEMENT_NODE) {
            if (node.tagName === "P") {
                const textContent = node.textContent;

                if (totalLength + textContent.length > maxLength) {
                    // Truncate the current <p> tag
                    const remainingLength = maxLength - totalLength;
                    resultHtml += `<p>${textContent.slice(
                        0,
                        remainingLength
                    )}...</p>`;
                    break; // Stop processing further <p> tags
                } else {
                    // Add the full <p> tag content
                    resultHtml += node.outerHTML;
                    totalLength += textContent.length; // Update total length
                }
            } else {
                // For non-<p> tags, add them directly
                resultHtml += node.outerHTML;
            }
        } else if (node.nodeType === Node.TEXT_NODE) {
            // Handle text nodes directly (if any)
            resultHtml += node.textContent;
        }
    }

    return resultHtml;
};

const ReadMore = ({ html, maxLength }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    // Sanitize the HTML input
    const sanitizedHtml = DOMPurify.sanitize(html);

    // Truncate HTML based on <p> tags only
    const visibleHtml = truncatePTagContent(sanitizedHtml, maxLength);

    return (
        <Container>
            {!isExpanded && (
                <div
                    dangerouslySetInnerHTML={{
                        __html: isExpanded ? sanitizedHtml : visibleHtml,
                    }}
                />
            )}
            {isExpanded && (
                <div dangerouslySetInnerHTML={{ __html: sanitizedHtml }} />
            )}
            <ToggleButton onClick={() => setIsExpanded(!isExpanded)}>
                {isExpanded ? "Show less" : "Read more..."}
            </ToggleButton>
        </Container>
    );
};

export default ReadMore;
